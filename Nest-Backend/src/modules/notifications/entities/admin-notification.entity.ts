import { Entity, Column, Index } from 'typeorm';
import { Expose } from 'class-transformer';
import { BaseEntity } from '../../../shared/entities/base.entity';

export enum AdminNotificationType {
  ORDER = 'order',
  INVENTORY = 'inventory',
  CUSTOMER = 'customer',
  SYSTEM_ALERT = 'system_alert',
}

@Entity('admin_notifications')
@Index(['type'])
@Index(['isRead'])
@Index(['createdAt'])
export class AdminNotification extends BaseEntity {
  @Expose()
  @Column({ type: 'enum', enum: AdminNotificationType })
  type: AdminNotificationType;

  @Expose()
  @Column({ length: 255 })
  title: string;

  @Expose()
  @Column({ type: 'text' })
  message: string;

  @Expose()
  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any> | null;

  @Expose()
  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Expose()
  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt: Date | null;
}
