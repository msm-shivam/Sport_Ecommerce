import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CmsPageStatus } from '../enums/cms-page-status.enum';
import { CmsPageType } from '../enums/cms-page-type.enum';

export class UpdateCmsPageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ enum: CmsPageStatus })
  @IsOptional()
  @IsEnum(CmsPageStatus)
  status?: CmsPageStatus;

  @ApiPropertyOptional({ enum: CmsPageType })
  @IsOptional()
  @IsEnum(CmsPageType)
  pageType?: CmsPageType;
}
