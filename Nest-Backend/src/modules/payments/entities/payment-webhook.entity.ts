import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('payment_webhooks')
@Index(['eventId'], { unique: true })
@Index(['eventType'])
export class PaymentWebhook extends BaseEntity {
  @Column({ name: 'event_id', type: 'varchar', length: 255, unique: true })
  eventId: string;

  @Column({ name: 'event_type', type: 'varchar', length: 100 })
  eventType: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;

  @Column({ type: 'boolean', default: false })
  processed: boolean;

  @Column({ name: 'processed_at', type: 'timestamptz', nullable: true })
  processedAt: Date | null;
}
