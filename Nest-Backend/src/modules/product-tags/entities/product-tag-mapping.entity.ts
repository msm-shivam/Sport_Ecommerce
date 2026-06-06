import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { ProductTag } from './product-tag.entity';

/**
 * product_tag_mappings — many-to-many join table.
 * product_id references products.id (FK added in Product migration).
 * tag_id references product_tags.id.
 *
 * Products are NOT built yet. product_id is stored as a plain UUID column
 * and the FK constraint will be added via the Product migration.
 */
@Entity('product_tag_mappings')
@Index(['productId', 'tagId'], { unique: true })
@Index(['productId'])
@Index(['tagId'])
export class ProductTagMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'tag_id', type: 'uuid' })
  tagId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => ProductTag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: ProductTag;
}
