import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('search_logs')
@Index(['keyword'])
@Index(['userId'])
@Index(['createdAt'])
export class SearchLog extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ length: 255 })
  keyword: string;

  @Column({ name: 'results_count', type: 'int', default: 0 })
  resultsCount: number;

  @Column({ name: 'clicked_product_id', type: 'uuid', nullable: true })
  clickedProductId: string | null;

  @Column({ name: 'converted_order_id', type: 'uuid', nullable: true })
  convertedOrderId: string | null;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;
}
