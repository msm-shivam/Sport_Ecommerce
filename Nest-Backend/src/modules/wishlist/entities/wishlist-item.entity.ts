import { Entity, Column, Index, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Wishlist } from './wishlist.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('wishlist_items')
@Index(['wishlistId'])
@Index(['productId'])
@Unique(['wishlistId', 'productId'])
export class WishlistItem extends BaseEntity {
  @Column({ name: 'wishlist_id', type: 'uuid' })
  wishlistId: string;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wishlist_id' })
  wishlist: Wishlist;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
