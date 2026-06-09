import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewImage } from './entities/review-image.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { AdminReviewsController } from './admin-reviews.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, ReviewImage, Order, OrderItem, Product]),
  ],
  controllers: [ReviewsController, AdminReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
