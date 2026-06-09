import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review for a delivered order item' })
  create(@Body() dto: CreateReviewDto, @Req() req: Request) {
    const userId: string = (req.user as Record<string, unknown>).id as string;
    return this.reviewsService.create(userId, dto);
  }

  @Get('reviews/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my reviews' })
  getMyReviews(@Req() req: Request) {
    const userId: string = (req.user as Record<string, unknown>).id as string;
    return this.reviewsService.findByUser(userId);
  }

  @Get('products/:productId/reviews')
  @ApiOperation({ summary: 'Get approved reviews for a product' })
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Patch('reviews/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own review (only if not approved)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @Req() req: Request,
  ) {
    const userId: string = (req.user as Record<string, unknown>).id as string;
    return this.reviewsService.update(id, userId, dto);
  }

  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own review' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId: string = (req.user as Record<string, unknown>).id as string;
    return this.reviewsService.remove(id, userId);
  }
}
