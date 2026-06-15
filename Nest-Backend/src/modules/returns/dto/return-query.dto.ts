import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ReturnRequestStatus } from '../enums/return-request-status.enum';

export class ReturnQueryDto {
  @ApiPropertyOptional({ enum: ReturnRequestStatus })
  @IsOptional()
  @IsEnum(ReturnRequestStatus)
  status?: ReturnRequestStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  limit?: number;
}
