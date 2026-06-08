import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('delivery_settings')
export class DeliverySetting extends BaseEntity {
  @Column({
    name: 'per_km_charge',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  perKmCharge: number;

  @Column({
    name: 'free_shipping_threshold',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  freeShippingThreshold: number;

  @Column({
    name: 'max_delivery_distance_km',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  maxDeliveryDistanceKm: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string | null;
}
