import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { DeliveryChargeType } from '../entities/delivery-charge.entity';

@Exclude()
export class DeliveryChargeResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() name: string;
  @Expose() @ApiPropertyOptional() description: string | null;
  @Expose() @ApiProperty() chargeAmount: number;
  @Expose() @ApiProperty({ enum: DeliveryChargeType }) chargeType: DeliveryChargeType;
  @Expose() @ApiProperty() isActive: boolean;
  @Expose() @ApiPropertyOptional() createdBy: string | null;
  @Expose() @ApiPropertyOptional() updatedBy: string | null;
  @Expose() @ApiProperty() createdAt: Date;
  @Expose() @ApiProperty() updatedAt: Date;
}
