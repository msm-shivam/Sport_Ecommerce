import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DeliverySettingResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() perKmCharge: number;
  @Expose() @ApiProperty() freeShippingThreshold: number;
  @Expose() @ApiProperty() maxDeliveryDistanceKm: number;
  @Expose() @ApiProperty() isActive: boolean;
  @Expose() @ApiPropertyOptional() updatedBy: string | null;
  @Expose() @ApiProperty() createdAt: Date;
  @Expose() @ApiProperty() updatedAt: Date;
}
