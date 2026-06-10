import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchAnalyticsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  period?: '7d' | '30d' | '90d';

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
