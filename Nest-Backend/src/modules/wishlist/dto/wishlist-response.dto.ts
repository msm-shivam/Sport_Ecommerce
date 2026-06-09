import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class WishlistProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

class WishlistVariantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sku: string;
}

export class WishlistItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product: WishlistProductDto;

  @ApiPropertyOptional({ type: WishlistVariantDto })
  variant?: WishlistVariantDto;

  @ApiProperty()
  addedAt: Date;
}

export class WishlistResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  totalItems: number;

  @ApiProperty({ type: [WishlistItemDto] })
  items: WishlistItemDto[];
}
