import { ApiProperty } from '@nestjs/swagger';

class WishlistProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

export class WishlistItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product: WishlistProductDto;

  @ApiProperty()
  createdAt: Date;
}

export class WishlistResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: [WishlistItemDto] })
  items: WishlistItemDto[];
}
