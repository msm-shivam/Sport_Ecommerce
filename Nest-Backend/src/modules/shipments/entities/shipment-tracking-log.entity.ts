import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Shipment } from './shipment.entity';
import { ShipmentStatus } from './shipment-status.enum';

@Entity('shipment_tracking_logs')
@Index(['shipmentId'])
export class ShipmentTrackingLog extends BaseEntity {
  @Column({ name: 'shipment_id', type: 'uuid' })
  shipmentId: string;

  @ManyToOne(() => Shipment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  @Column({
    type: 'enum',
    enum: ShipmentStatus,
  })
  status: ShipmentStatus;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @Column({ name: 'changed_by', type: 'uuid', nullable: true })
  changedBy: string | null;
}
