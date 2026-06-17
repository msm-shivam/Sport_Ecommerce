import { Transform, Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AuditLogQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value || undefined)
  action?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value || undefined)
  entityType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value || undefined)
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  @Transform(({ value }: { value: string }) => value || undefined)
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  @Transform(({ value }: { value: string }) => value || undefined)
  dateTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
