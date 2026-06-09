import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { ReviewImage } from './review-image.entity';
import { ReviewStatus } from '../enums/review-status.enum';

@Entity('reviews')
@Index(['productId'])
@Index(['userId'])
@Index(['status'])
@Index(['orderItemId'], { unique: true })
export class Review extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_item_id', type: 'uuid', unique: true })
  orderItemId: string;

  @ManyToOne(() => OrderItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_item_id' })
  orderItem: OrderItem;

  @Column({ type: 'smallint' })
  rating: number;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus;

  @Column({ name: 'is_verified_purchase', default: true })
  isVerifiedPurchase: boolean;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @OneToMany(() => ReviewImage, (img) => img.review, { cascade: true })
  images: ReviewImage[];
}
