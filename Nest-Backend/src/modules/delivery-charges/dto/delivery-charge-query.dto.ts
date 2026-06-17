import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { DeliveryChargeType } from '../entities/delivery-charge.entity';

export class DeliveryChargeQueryDto {
  @ApiPropertyOptional({ enum: DeliveryChargeType })
  @IsEnum(DeliveryChargeType)
  @IsOptional()
  chargeType?: DeliveryChargeType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsOptional()
  limit?: number;
}
