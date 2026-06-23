import { Expose } from 'class-transformer';
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { CmsPageStatus } from '../enums/cms-page-status.enum';
import { CmsPageType } from '../enums/cms-page-type.enum';

@Entity('cms_pages')
@Index(['slug'], { unique: true })
@Index(['status'])
@Index(['pageType'])
@Index(['createdAt'])
export class CmsPage extends BaseEntity {
  @Expose()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Expose()
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Expose()
  @Column({ type: 'text' })
  content: string;

  @Expose()
  @Column({ type: 'enum', enum: CmsPageStatus, default: CmsPageStatus.DRAFT })
  status: CmsPageStatus;

  @Expose()
  @Column({
    name: 'page_type',
    type: 'enum',
    enum: CmsPageType,
    nullable: true,
  })
  pageType: CmsPageType | null;
}
