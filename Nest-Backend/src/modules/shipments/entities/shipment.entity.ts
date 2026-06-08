import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Order } from '../../orders/entities/order.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import { ShipmentTrackingLog } from './shipment-tracking-log.entity';
import { ShipmentStatus } from './shipment-status.enum';

@Entity('shipments')
@Index(['orderId'])
@Index(['trackingNumber'], { unique: true })
@Index(['status'])
export class Shipment extends BaseEntity {
  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({
    name: 'tracking_number',
    type: 'varchar',
    length: 50,
    unique: true,
  })
  trackingNumber: string;

  @Column({
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.PENDING,
  })
  status: ShipmentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'dispatched_at', type: 'timestamptz', nullable: true })
  dispatchedAt: Date | null;

  @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })
  deliveredAt: Date | null;

  @OneToMany(() => ShipmentTrackingLog, (log) => log.shipment, {
    cascade: true,
  })
  trackingLogs: ShipmentTrackingLog[];
}
