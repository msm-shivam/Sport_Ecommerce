import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { AppDataSource } from '../data-source';
import { faker } from '@faker-js/faker';
import { User } from '../../modules/users/entities/user.entity';
import { Product } from '../../modules/products/entities/product.entity';
import { ProductVariant } from '../../modules/product-variants/entities/product-variant.entity';
import { OrderStatus } from '../../modules/orders/entities/order.entity';
import { PaymentStatus } from '../../modules/payments/entities/payment-status.enum';
import { PaymentMethod } from '../../modules/payments/entities/payment-method.entity';
import { Address } from '../../modules/addresses/entities/address.entity';
import { Warehouse } from '../../modules/warehouses/entities/warehouse.entity';
import { ShipmentStatus } from '../../modules/shipments/entities/shipment-status.enum';
import { v4 as uuid } from 'uuid';

dotenv.config();

async function seedRealData() {
  console.log('🌱 Connecting to database...');
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();

  // ─── Fetch existing records ──────────────────────────────────────────────
  const users = await AppDataSource.getRepository(User).find({ take: 10 });
  if (users.length === 0) throw new Error('No users found. Run seed.ts first.');

  const products = await AppDataSource.getRepository(Product).find({
    where: { isActive: true },
    relations: { images: true },
    take: 15,
  });
  if (products.length === 0) throw new Error('No products found. Run seed:data first.');

  const variants = await AppDataSource.getRepository(ProductVariant).find({ take: 30 });
  const warehouses = await AppDataSource.getRepository(Warehouse).find({ take: 2 });
  const addresses = await AppDataSource.getRepository(Address).find({ take: 10 });
  const paymentMethods = await AppDataSource.getRepository(PaymentMethod).find({ take: 2 });

  console.log(`  Users: ${users.length}, Products: ${products.length}, Variants: ${variants.length}`);
  console.log(`  Warehouses: ${warehouses.length}, Addresses: ${addresses.length}`);

  // Clean up previous seed data (reverse dependency order)
  await queryRunner.query(`DELETE FROM shipment_tracking_logs`);
  await queryRunner.query(`DELETE FROM shipments`);
  await queryRunner.query(`DELETE FROM payments`);
  await queryRunner.query(`DELETE FROM order_items`);
  await queryRunner.query(`DELETE FROM orders WHERE order_number LIKE 'ORD-RL-%'`);
  console.log('  Cleared previous seed orders, items, payments, shipments');

  const now = new Date();
  const statuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED];
  const shipmentStatuses = [ShipmentStatus.PACKED, ShipmentStatus.READY_FOR_DISPATCH, ShipmentStatus.OUT_FOR_DELIVERY, ShipmentStatus.DELIVERED];

  let orderCount = 0;
  let itemCount = 0;
  let paymentCount = 0;
  let shipmentCount = 0;

  for (let i = 0; i < 50; i++) {
    const daysAgo = faker.number.int({ min: 1, max: 180 });
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
    const status = statuses[faker.number.int({ min: 0, max: statuses.length - 1 })];
    const warehouse = warehouses.length > 0 ? warehouses[faker.number.int({ min: 0, max: warehouses.length - 1 })] : null;
    const address = addresses.length > 0 ? addresses[faker.number.int({ min: 0, max: addresses.length - 1 })] : null;

    const itemCountInOrder = faker.number.int({ min: 1, max: 3 });
    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      variantId: string;
      productName: string;
      sku: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (let j = 0; j < itemCountInOrder; j++) {
      const product = products[faker.number.int({ min: 0, max: products.length - 1 })];
      const variant = variants.length > 0 ? variants[faker.number.int({ min: 0, max: variants.length - 1 })] : null;
      const qty = faker.number.int({ min: 1, max: 3 });
      const unitPrice = parseFloat(faker.finance.amount({ min: 500, max: 8000, dec: 0 }));
      const totalPrice = qty * unitPrice;
      subtotal += totalPrice;

      orderItems.push({
        productId: product.id,
        variantId: variant?.id ?? product.id,
        productName: product.name,
        sku: variant?.sku ?? 'N/A',
        quantity: qty,
        unitPrice,
        totalPrice,
      });
    }

    const discountAmount = subtotal > 5000 ? parseFloat(faker.finance.amount({ min: 100, max: 500, dec: 0 })) : 0;
    const totalAmount = subtotal - discountAmount;
    const orderNumber = `ORD-RL-${String(1000 + i).padStart(4, '0')}`;

    const isPaid = status !== OrderStatus.CANCELLED && status !== OrderStatus.PENDING;
    const paidAmount = isPaid ? totalAmount : 0;

    // Insert order
    const orderId = uuid();
    await queryRunner.query(
      `INSERT INTO orders (id, order_number, user_id, status, subtotal, discount_amount, shipping_amount, delivery_charge, cod_charge, handling_charge, tax_amount, total_amount, paid_amount, due_amount, payment_status, shipping_address_id, warehouse_id, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 0, 0, 0, 0, 0, $7, $8, 0, $9, $10, $11, $12, $13, $14)`,
      [
        orderId, orderNumber, user.id, status, subtotal, discountAmount,
        totalAmount, paidAmount,
        isPaid ? PaymentStatus.PAID : (status === OrderStatus.CANCELLED ? PaymentStatus.REFUNDED : PaymentStatus.PENDING),
        address?.id ?? null, warehouse?.id ?? null,
        faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }) ?? null,
        createdAt, createdAt,
      ],
    );
    orderCount++;

    // Insert order items
    for (const item of orderItems) {
      await queryRunner.query(
        `INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, sku, quantity, unit_price, total_price, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)`,
        [uuid(), orderId, item.productId, item.variantId, item.productName, item.sku, item.quantity, item.unitPrice, item.totalPrice, createdAt],
      );
      itemCount++;
    }

    // Insert payment for paid orders
    if (isPaid && paymentMethods.length > 0) {
      const paymentMethod = paymentMethods[faker.number.int({ min: 0, max: paymentMethods.length - 1 })];
      await queryRunner.query(
        `INSERT INTO payments (id, order_id, payment_method_id, amount, status, transaction_number, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [uuid(), orderId, paymentMethod.id, paidAmount, PaymentStatus.PAID, `TXN-${orderId.slice(0, 8).toUpperCase()}`, createdAt, createdAt],
      );
      paymentCount++;
    }

    // Insert shipment for shipped/delivered orders
    if ((status === OrderStatus.SHIPPED || status === OrderStatus.DELIVERED) && warehouse) {
      const shipmentId = uuid();
      const shippedAt = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000);
      const deliveredAt = status === OrderStatus.DELIVERED
        ? new Date(shippedAt.getTime() + faker.number.int({ min: 1, max: 5 }) * 24 * 60 * 60 * 1000)
        : null;
      const shipmentStatus = status === OrderStatus.DELIVERED ? ShipmentStatus.DELIVERED : ShipmentStatus.READY_FOR_DISPATCH;

      await queryRunner.query(
        `INSERT INTO shipments (id, order_id, warehouse_id, status, tracking_number, dispatched_at, delivered_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)`,
        [shipmentId, orderId, warehouse.id, shipmentStatus,
         faker.string.alphanumeric(10).toUpperCase(),
         shippedAt, deliveredAt, createdAt],
      );
      shipmentCount++;

      // Tracking logs
      const trackStatuses = [ShipmentStatus.PACKED, ShipmentStatus.READY_FOR_DISPATCH, ShipmentStatus.OUT_FOR_DELIVERY];
      for (let t = 0; t < trackStatuses.length; t++) {
        const logDate = new Date(createdAt.getTime() + (t + 1) * 12 * 60 * 60 * 1000);
        await queryRunner.query(
          `INSERT INTO shipment_tracking_logs (id, shipment_id, status, note, changed_by, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NULL, $5, $5)`,
          [uuid(), shipmentId, trackStatuses[t], `Shipment ${trackStatuses[t].replace(/_/g, ' ').toLowerCase()}`, logDate],
        );
      }

      if (deliveredAt) {
        await queryRunner.query(
          `INSERT INTO shipment_tracking_logs (id, shipment_id, status, note, changed_by, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NULL, $5, $5)`,
          [uuid(), shipmentId, ShipmentStatus.DELIVERED, 'Package delivered successfully', deliveredAt],
        );
      }
    }
  }

  await queryRunner.release();
  await AppDataSource.destroy();

  console.log('\n✅ Real data seed completed!');
  console.log(`  Orders: ${orderCount}, Items: ${itemCount}`);
  console.log(`  Payments: ${paymentCount}, Shipments: ${shipmentCount}`);
  console.log('\n📅 All records have realistic dates spread across the last 6 months.');
}

seedRealData().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
