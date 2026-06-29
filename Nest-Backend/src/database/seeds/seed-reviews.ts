import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { AppDataSource } from '../data-source';
import { v4 as uuid } from 'uuid';

dotenv.config();

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function seed() {
  console.log('Connecting...');
  await AppDataSource.initialize();
  const qr = AppDataSource.createQueryRunner();

  const cleanTables = [
    'review_reports', 'review_helpful_votes', 'review_images', 'reviews',
  ];
  for (const name of cleanTables) {
    try { await qr.query(`DELETE FROM "${name}"`); } catch { /* skip */ }
  }
  console.log('Cleared reviews data');

  const now = new Date();

  // Fetch users
  const userRows = await qr.query(
    `SELECT id, first_name, last_name, email, created_at FROM users WHERE deleted_at IS NULL ORDER BY created_at`,
  );
  console.log(`  Found ${userRows.length} users`);

  // Fetch orders with items (only PAID/DELIVERED orders)
  const orderRows = await qr.query(
    `SELECT o.id, o.order_number, o.user_id, o.created_at
     FROM orders o
     WHERE o.payment_status IN ('PAID', 'REFUNDED')
       AND o.status IN ('DELIVERED', 'RETURNED')
     ORDER BY o.created_at`,
  );
  console.log(`  Found ${orderRows.length} eligible orders`);

  // Fetch order items with product info
  const itemRows = await qr.query(
    `SELECT oi.id, oi.order_id, oi.product_id, oi.variant_id, oi.product_name, oi.sku
     FROM order_items oi
     ORDER BY oi.created_at`,
  );
  console.log(`  Found ${itemRows.length} order items`);

  // Fetch admin for approval
  const adminRows = await qr.query(`SELECT id FROM admin_users LIMIT 1`);
  const adminId = adminRows[0]?.id ?? null;

  // Group items by order
  const itemsByOrder: Record<string, typeof itemRows> = {};
  for (const item of itemRows) {
    if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
    itemsByOrder[item.order_id].push(item);
  }

  const reviewTexts = [
    { rating: 5, title: 'Excellent product!', comment: 'Absolutely love this product! The quality is outstanding and it fits perfectly. Would highly recommend to anyone looking for a great purchase.' },
    { rating: 5, title: 'Great quality', comment: 'Very satisfied with my purchase. The material is high quality and the delivery was fast. Will buy again.' },
    { rating: 4, title: 'Very good', comment: 'Good product for the price. Slight issue with sizing but overall happy with the purchase.' },
    { rating: 4, title: 'Nice product', comment: 'Product is as described. Good quality and comfortable. Shipping took a bit longer than expected.' },
    { rating: 3, title: 'Average', comment: 'Decent product but not exactly what I expected. The color is slightly different from the picture.' },
    { rating: 5, title: 'Highly recommend', comment: 'Best purchase I have made this year. The quality exceeded my expectations. Five stars!' },
    { rating: 4, title: 'Good value', comment: 'Good value for money. The product is well-made and looks great. Happy customer.' },
  ];

  const imageUrls = [
    '/uploads/reviews/review-1.jpg',
    '/uploads/reviews/review-2.jpg',
    '/uploads/reviews/review-3.jpg',
  ];

  let reviewCount = 0, imageCount = 0, voteCount = 0;

  // Create reviews for each order item
  let reviewIdx = 0;
  for (const order of orderRows) {
    const user = userRows.find((u: any) => u.id === order.user_id);
    if (!user) continue;

    const items = itemsByOrder[order.id] ?? [];
    if (items.length === 0) continue;

    for (const item of items) {
      const reviewId = uuid();
      const reviewData = reviewTexts[reviewIdx % reviewTexts.length];
      const createdAt = addDays(new Date(order.created_at), reviewIdx + 3);
      const status = reviewIdx % 2 === 0 ? 'APPROVED' : 'PENDING';

      await qr.query(
        `INSERT INTO reviews (id, user_id, product_id, variant_id, order_id, order_item_id, rating, title, comment, status, is_verified_purchase, helpful_count, approved_by, approved_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, $11, $12, $13, $14, $14)`,
        [reviewId, user.id, item.product_id, item.variant_id, order.id, item.id,
         reviewData.rating, reviewData.title, reviewData.comment, status,
         reviewData.rating >= 4 ? 2 : 0,
         status === 'APPROVED' ? adminId : null,
         status === 'APPROVED' ? createdAt : null,
         createdAt],
      );
      reviewCount++;

      // Add image for some reviews
      if (reviewIdx % 3 === 0) {
        for (let i = 0; i < 2; i++) {
          await qr.query(
            `INSERT INTO review_images (id, review_id, image_url, sort_order, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $5)`,
            [uuid(), reviewId, imageUrls[i], i, createdAt],
          );
          imageCount++;
        }
      }

      // Add helpful votes for approved reviews
      if (status === 'APPROVED') {
        const otherUsers = userRows.filter((u: any) => u.id !== user.id);
        for (let v = 0; v < Math.min(2, otherUsers.length); v++) {
          await qr.query(
            `INSERT INTO review_helpful_votes (id, review_id, user_id, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $4)`,
            [uuid(), reviewId, otherUsers[v].id, createdAt],
          );
          voteCount++;
        }
      }

      reviewIdx++;
    }
  }

  console.log(`\nReviews: ${reviewCount}, Images: ${imageCount}, Helpful Votes: ${voteCount}`);

  await qr.release();
  await AppDataSource.destroy();
  console.log('\nReviews seed completed!');
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
