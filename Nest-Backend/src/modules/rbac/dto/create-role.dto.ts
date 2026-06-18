import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Product Manager' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'product_manager' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9_]+$/, {
    message: 'Slug must be lowercase letters, numbers, and underscores only.',
  })
  slug: string;

  @ApiPropertyOptional({ example: 'Manages product catalog' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Permission slugs to assign at creation',
    example: ['product.create', 'product.view'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionSlugs?: string[];
}
