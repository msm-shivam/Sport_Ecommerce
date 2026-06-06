import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTag } from './entities/product-tag.entity';
import { ProductTagsService } from './product-tags.service';
import { ProductTagsController } from './product-tags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTag])],
  controllers: [ProductTagsController],
  providers: [ProductTagsService],
  exports: [ProductTagsService],
})
export class ProductTagsModule {}
