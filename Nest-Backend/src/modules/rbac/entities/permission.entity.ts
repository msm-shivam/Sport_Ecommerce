import { Expose } from 'class-transformer';
import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Role } from './role.entity';

@Entity('permissions')
@Index(['slug'], { unique: true })
export class Permission extends BaseEntity {
  @Expose()
  @Column({ length: 100 })
  name: string;

  @Expose()
  @Column({ unique: true, length: 100 })
  slug: string;

  @Expose()
  @Column({ length: 100 })
  module: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
