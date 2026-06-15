import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PurchaseOrderStatus } from '../enums/purchase-order-status.enum';

export class PurchaseOrderQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: PurchaseOrderStatus })
  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supplierId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  limit?: number = 20;
}
