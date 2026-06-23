import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CmsPageStatus } from '../enums/cms-page-status.enum';
import { CmsPageType } from '../enums/cms-page-type.enum';

export class CmsPageQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Search by title or content' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CmsPageStatus })
  @IsOptional()
  @IsEnum(CmsPageStatus)
  status?: CmsPageStatus;

  @ApiPropertyOptional({ enum: CmsPageType })
  @IsOptional()
  @IsEnum(CmsPageType)
  pageType?: CmsPageType;
}
