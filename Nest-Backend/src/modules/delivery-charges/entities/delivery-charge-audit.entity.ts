import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { DeliveryCharge } from './delivery-charge.entity';

@Entity('delivery_charge_audits')
export class DeliveryChargeAudit extends BaseEntity {
  @Column({ name: 'delivery_charge_id', type: 'uuid' })
  deliveryChargeId: string;

  @ManyToOne(() => DeliveryCharge, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'delivery_charge_id' })
  deliveryCharge: DeliveryCharge;

  @Column({ name: 'old_value', type: 'jsonb', nullable: true })
  oldValue: Record<string, unknown> | null;

  @Column({ name: 'new_value', type: 'jsonb', nullable: true })
  newValue: Record<string, unknown> | null;

  @Column({ name: 'changed_by', type: 'uuid', nullable: true })
  changedBy: string | null;

  @Column({ name: 'changed_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  changedAt: Date;
}
