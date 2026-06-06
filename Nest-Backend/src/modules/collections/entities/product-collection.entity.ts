import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Collection } from './collection.entity';

/**
 * product_collections — many-to-many join table.
 * product_id references products.id (FK added in Product migration).
 * collection_id references collections.id.
 *
 * Products are NOT built yet. product_id is stored as a plain UUID column
 * and the FK constraint will be added via the Product migration.
 */
@Entity('product_collections')
@Index(['productId', 'collectionId'], { unique: true })
@Index(['productId'])
@Index(['collectionId'])
export class ProductCollection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'collection_id', type: 'uuid' })
  collectionId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => Collection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;
}
