import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('payment_methods')
@Index(['code'], { unique: true })
@Index(['isActive'])
export class PaymentMethod extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;
}
