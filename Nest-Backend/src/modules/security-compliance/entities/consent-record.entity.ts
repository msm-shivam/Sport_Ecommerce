import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { ConsentType } from '../enums/consent-type.enum';

@Entity('consent_records')
@Index(['userId'])
@Index(['consentType'])
@Index(['createdAt'])
export class ConsentRecord extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: ConsentType })
  consentType: ConsentType;

  @Column({ type: 'boolean', default: false })
  accepted: boolean;

  @Column({ name: 'accepted_at', type: 'timestamptz', default: () => 'NOW()' })
  acceptedAt: Date;
}
