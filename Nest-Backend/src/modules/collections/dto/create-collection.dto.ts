import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({ example: 'Summer Collection' })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    example: 'summer-collection',
    description: 'Auto-generated from name if not provided',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  @MaxLength(150)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must be lowercase letters, numbers, and hyphens.',
  })
  slug?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: any;

  @ApiPropertyOptional({ example: 'Hot styles for the summer season' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: ['uuid1', 'uuid2'],
    description: 'Product IDs to link to this collection. Send as JSON string in multipart.',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return []; }
    }
    return value;
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  productIds?: string[];
}
