import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CmsPageStatus } from '../enums/cms-page-status.enum';
import { CmsPageType } from '../enums/cms-page-type.enum';

export class CreateCmsPageDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ enum: CmsPageStatus })
  @IsOptional()
  @IsEnum(CmsPageStatus)
  status?: CmsPageStatus;

  @ApiPropertyOptional({ enum: CmsPageType })
  @IsOptional()
  @IsEnum(CmsPageType)
  pageType?: CmsPageType;
}
