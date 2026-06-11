import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('homepage_sections')
@Index(['sectionKey'])
@Index(['sortOrder'])
@Index(['createdAt'])
export class HomepageSection extends BaseEntity {
  @Column({ name: 'section_key', type: 'varchar', length: 100 })
  sectionKey: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'content_json', type: 'jsonb' })
  contentJson: Record<string, unknown>;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;
}
