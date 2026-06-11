import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('report_execution_logs')
@Index(['reportName'])
@Index(['generatedAt'])
@Index(['createdAt'])
export class ReportExecutionLog extends BaseEntity {
  @Column({ name: 'report_name', type: 'varchar', length: 255 })
  reportName: string;

  @Column({ name: 'executed_by', type: 'uuid', nullable: true })
  executedBy: string | null;

  @Column({ name: 'execution_time_ms', type: 'integer', default: 0 })
  executionTimeMs: number;

  @Column({ name: 'generated_at', type: 'timestamptz', default: () => 'NOW()' })
  generatedAt: Date;
}
