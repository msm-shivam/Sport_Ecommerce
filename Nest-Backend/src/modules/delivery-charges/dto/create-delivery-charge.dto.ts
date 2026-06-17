import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { DeliveryChargeType } from '../entities/delivery-charge.entity';

export class CreateDeliveryChargeDto {
  @ApiProperty({ example: 'Standard Delivery' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Standard delivery charge for all orders' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 99, description: 'Charge amount in currency units' })
  @IsNumber()
  @Min(0)
  chargeAmount: number;

  @ApiProperty({ enum: DeliveryChargeType, example: DeliveryChargeType.FIXED_DELIVERY })
  @IsEnum(DeliveryChargeType)
  @IsNotEmpty()
  chargeType: DeliveryChargeType;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
