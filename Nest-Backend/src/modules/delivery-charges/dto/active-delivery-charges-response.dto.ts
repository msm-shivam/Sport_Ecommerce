import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ActiveDeliveryChargesResponseDto {
  @Expose() @ApiProperty({ description: 'Fixed delivery charge amount', example: 99 })
  deliveryCharge: number;

  @Expose() @ApiProperty({ description: 'Free shipping threshold amount', example: 2000 })
  freeShippingThreshold: number;

  @Expose() @ApiProperty({ description: 'COD charge amount', example: 49 })
  codCharge: number;

  @Expose() @ApiProperty({ description: 'Handling charge amount', example: 0 })
  handlingCharge: number;
}
