import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  getWishlist(@Req() req: Request) {
    const userId: string = (req.user as Record<string, unknown>).id as string;
    return this.wishlistService.getOrCreate(userId);
  }

  @Post('products/:productId')
  @ApiOperation({ summary: 'Add product to wishlist' })
  addProduct(
    @Param('productId') productId: string,
    @Req() req: Request,
  ) {
    const userId: string = (req.user as Record<string, unknown>).id as string;
    return this.wishlistService.addProduct(userId, productId);
  }

  @Delete('products/:productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  removeProduct(
    @Param('productId') productId: string,
    @Req() req: Request,
  ) {
    const userId: string = (req.user as Record<string, unknown>).id as string;
    return this.wishlistService.removeProduct(userId, productId);
  }
}
