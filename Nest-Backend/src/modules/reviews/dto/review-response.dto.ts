import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ReviewUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

class ReviewProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

class ReviewImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  sortOrder: number;
}

export class ReviewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  rating: number;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  comment?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  isVerifiedPurchase: boolean;

  @ApiProperty()
  user: ReviewUserDto;

  @ApiProperty()
  product: ReviewProductDto;

  @ApiProperty({ type: [ReviewImageDto] })
  images: ReviewImageDto[];

  @ApiProperty()
  createdAt: Date;
}
