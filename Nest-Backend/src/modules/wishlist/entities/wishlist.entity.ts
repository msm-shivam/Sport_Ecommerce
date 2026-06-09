import { Entity, Column, Index, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { WishlistItem } from './wishlist-item.entity';

@Entity('wishlists')
@Index(['userId'], { unique: true })
export class Wishlist extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => WishlistItem, (item) => item.wishlist)
  items: WishlistItem[];
}
