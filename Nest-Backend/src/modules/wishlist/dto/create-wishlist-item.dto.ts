import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWishlistItemDto {
  @ApiProperty({ description: 'Product ID to add to wishlist' })
  @IsString()
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({ description: 'Optional variant ID' })
  @IsOptional()
  @IsString()
  @IsUUID()
  variantId?: string;
}

export class SaveForLaterDto {
  @ApiProperty({ description: 'Cart item ID to save for later' })
  @IsString()
  @IsUUID()
  cartItemId: string;
}
