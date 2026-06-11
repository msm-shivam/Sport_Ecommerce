import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('site_configurations')
export class SiteConfiguration extends BaseEntity {
  @Column({ name: 'site_name', type: 'varchar', length: 255 })
  siteName: string;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ name: 'favicon_url', type: 'varchar', length: 500, nullable: true })
  faviconUrl: string | null;

  @Column({ name: 'maintenance_mode', type: 'boolean', default: false })
  maintenanceMode: boolean;
}
