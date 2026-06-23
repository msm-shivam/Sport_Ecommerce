import { Expose } from 'class-transformer';
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('faqs')
@Index(['sortOrder'])
@Index(['isActive'])
@Index(['createdAt'])
@Index(['category'])
export class Faq extends BaseEntity {
  @Expose()
  @Column({ type: 'text' })
  question: string;

  @Expose()
  @Column({ type: 'text' })
  answer: string;

  @Expose()
  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null;

  @Expose()
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Expose()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
