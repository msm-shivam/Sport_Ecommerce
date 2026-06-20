import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { VariantStatus } from '../../product-variants/entities/product-variant.entity';

@Exclude()
class ProductInfo {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() name: string;
  @Expose() @ApiProperty() slug: string;
  @Expose() @ApiPropertyOptional() imageUrl: string | null;
}

@Exclude()
class VariantInfo {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() sku: string;
  @Expose() @ApiProperty() price: number;
  @Expose() @ApiProperty({ enum: VariantStatus }) status: VariantStatus;
}

@Exclude()
class WishlistItemDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() productId: string;
  @Expose() @ApiPropertyOptional() variantId: string | null;

  @Expose()
  @ApiProperty({ type: ProductInfo })
  @Type(() => ProductInfo)
  product: ProductInfo;

  @Expose()
  @ApiPropertyOptional({ type: VariantInfo })
  @Type(() => VariantInfo)
  variant: VariantInfo | null;

  @Expose() @ApiProperty() addedAt: Date;
  @Expose() @ApiProperty() createdAt: Date;
  @Expose() @ApiProperty() updatedAt: Date;
}

@Exclude()
class UserInfo {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() firstName: string;
  @Expose() @ApiProperty() lastName: string;
  @Expose() @ApiProperty() email: string;
}

@Exclude()
export class AdminWishlistResponseDto {
  @Expose()
  @ApiProperty({ type: UserInfo })
  @Type(() => UserInfo)
  user: UserInfo;

  @Expose() @ApiProperty() totalItems: number;

  @Expose()
  @ApiProperty({ type: [WishlistItemDto] })
  @Type(() => WishlistItemDto)
  items: WishlistItemDto[];
}
