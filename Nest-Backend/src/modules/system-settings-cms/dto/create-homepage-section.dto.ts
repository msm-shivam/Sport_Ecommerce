import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateHomepageSectionDto {
  @ApiProperty()
  @IsString()
  sectionKey: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsObject()
  contentJson: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
