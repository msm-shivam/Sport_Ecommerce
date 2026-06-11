import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('login_activities')
@Index(['userId'])
@Index(['status'])
@Index(['loginAt'])
@Index(['createdAt'])
export class LoginActivity extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 50, nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'varchar', length: 500, nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ name: 'login_at', type: 'timestamptz', default: () => 'NOW()' })
  loginAt: Date;
}
