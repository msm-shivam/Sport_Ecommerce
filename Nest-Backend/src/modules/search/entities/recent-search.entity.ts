import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('recent_searches')
@Index(['userId', 'keyword'], { unique: true })
@Index(['userId'])
@Index(['createdAt'])
export class RecentSearch extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ length: 255 })
  keyword: string;
}
