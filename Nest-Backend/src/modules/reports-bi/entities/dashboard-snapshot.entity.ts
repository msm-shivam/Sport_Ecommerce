import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { DashboardType } from '../enums/dashboard-type.enum';

@Entity('dashboard_snapshots')
@Index(['snapshotDate'])
@Index(['dashboardType'])
@Index(['createdAt'])
export class DashboardSnapshot extends BaseEntity {
  @Column({ name: 'snapshot_date', type: 'timestamptz' })
  snapshotDate: Date;

  @Column({ name: 'dashboard_type', type: 'enum', enum: DashboardType })
  dashboardType: DashboardType;

  @Column({ name: 'metrics_json', type: 'jsonb' })
  metricsJson: Record<string, unknown>;
}
