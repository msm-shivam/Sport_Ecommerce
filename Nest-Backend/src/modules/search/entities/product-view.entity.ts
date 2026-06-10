import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('product_views')
@Index(['userId'])
@Index(['productId'])
@Index(['createdAt'])
export class ProductView extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;
}
