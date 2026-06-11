import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { ReportType } from '../enums/report-type.enum';

@Entity('saved_reports')
@Index(['name'])
@Index(['reportType'])
@Index(['createdBy'])
@Index(['createdAt'])
export class SavedReport extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: ReportType })
  reportType: ReportType;

  @Column({ name: 'filters_json', type: 'jsonb' })
  filtersJson: Record<string, unknown>;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;
}
