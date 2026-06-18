import { Column, Entity, Index, ManyToMany, JoinTable } from 'typeorm';
import { Expose, Type } from 'class-transformer';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Permission } from './permission.entity';

@Entity('roles')
@Index(['slug'], { unique: true })
export class Role extends BaseEntity {
  @Expose()
  @Column({ length: 100 })
  name: string;

  @Expose()
  @Column({ unique: true, length: 100 })
  slug: string;

  @Expose()
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Expose()
  @Type(() => Permission)
  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: false,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
