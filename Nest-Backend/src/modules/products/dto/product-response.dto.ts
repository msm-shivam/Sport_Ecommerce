import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '../entities/product.entity';

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  brandId: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  subCategoryId: string;

  @ApiProperty({ example: 'Nike Air Zoom Pegasus 41' })
  name: string;

  @ApiProperty({ example: 'nike-air-zoom-pegasus-41' })
  slug: string;

  @ApiPropertyOptional({ example: 'NIKE-PEGASUS-41' })
  skuPrefix?: string;

  @ApiPropertyOptional({ example: 'Lightweight and responsive running shoe' })
  shortDescription?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  status: ProductStatus;

  @ApiPropertyOptional()
  metaTitle?: string;

  @ApiPropertyOptional()
  metaDescription?: string;

  @ApiPropertyOptional()
  metaKeywords?: string;

  @ApiProperty({ example: false })
  isFeatured: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt?: Date;
}
