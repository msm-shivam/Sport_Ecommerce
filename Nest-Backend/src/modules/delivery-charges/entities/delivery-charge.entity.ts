import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

export enum DeliveryChargeType {
  FIXED_DELIVERY = 'FIXED_DELIVERY',
  FREE_SHIPPING_THRESHOLD = 'FREE_SHIPPING_THRESHOLD',
  COD_CHARGE = 'COD_CHARGE',
  HANDLING_CHARGE = 'HANDLING_CHARGE',
}

@Entity('delivery_charges')
@Index(['chargeType'])
@Index(['isActive'])
export class DeliveryCharge extends BaseEntity {
  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'charge_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  chargeAmount: number;

  @Column({
    name: 'charge_type',
    type: 'enum',
    enum: DeliveryChargeType,
  })
  chargeType: DeliveryChargeType;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string | null;
}
