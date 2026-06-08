import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Payment } from './payment.entity';

@Entity('payment_logs')
@Index(['paymentId'])
export class PaymentLog extends BaseEntity {
  @Column({ name: 'payment_id', type: 'uuid' })
  paymentId: string;

  @ManyToOne(() => Payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({
    name: 'performed_by',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  performedBy: string | null;
}
