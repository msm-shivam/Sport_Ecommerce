import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class SecurityEventQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  eventType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  limit?: number;
}
