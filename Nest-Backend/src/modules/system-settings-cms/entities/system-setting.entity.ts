import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('system_settings')
@Index(['key'], { unique: true })
@Index(['category'])
@Index(['createdAt'])
export class SystemSetting extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null;
}
