import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ProductImageResponseDto } from './dto/product-image-response.dto';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { DefaultPermissions } from '../../common/constants/roles.constants';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('Admin — Products')
@ApiBearerAuth('JWT')
@UseGuards(AdminJwtGuard, PermissionsGuard)
@Controller('admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ─── Product CRUD ──────────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(DefaultPermissions.PRODUCT_CREATE)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created.' })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_VIEW)
  @ApiOperation({ summary: 'List products with pagination' })
  @ApiPaginatedResponse(ProductResponseDto)
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_VIEW)
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product returned.', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_UPDATE)
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_DELETE)
  @ApiOperation({ summary: 'Soft delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  // ─── Product Status ────────────────────────────────────────────────────────

  @Patch(':id/publish')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_PUBLISH)
  @ApiOperation({ summary: 'Publish a product (set status to ACTIVE)' })
  @ApiResponse({ status: 200, description: 'Product published.' })
  async publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.publish(id);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_ARCHIVE)
  @ApiOperation({ summary: 'Archive a product (set status to ARCHIVED)' })
  @ApiResponse({ status: 200, description: 'Product archived.' })
  async archive(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.archive(id);
  }

  // ─── Collections ──────────────────────────────────────────────────────────

  @Post(':id/collections')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(DefaultPermissions.PRODUCT_UPDATE)
  @ApiOperation({ summary: 'Assign collections to a product' })
  @ApiResponse({ status: 201, description: 'Collections assigned.' })
  async assignCollections(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { collectionIds: string[] },
  ) {
    return this.productsService.assignCollections(id, body.collectionIds);
  }

  @Delete(':id/collections/:collectionId')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_UPDATE)
  @ApiOperation({ summary: 'Remove a collection from a product' })
  @ApiResponse({ status: 200, description: 'Collection removed.' })
  async removeCollection(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
  ) {
    return this.productsService.removeCollection(id, collectionId);
  }

  // ─── Tags ─────────────────────────────────────────────────────────────────

  @Post(':id/tags')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(DefaultPermissions.PRODUCT_UPDATE)
  @ApiOperation({ summary: 'Assign tags to a product' })
  @ApiResponse({ status: 201, description: 'Tags assigned.' })
  async assignTags(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { tagIds: string[] },
  ) {
    return this.productsService.assignTags(id, body.tagIds);
  }

  @Delete(':id/tags/:tagId')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_UPDATE)
  @ApiOperation({ summary: 'Remove a tag from a product' })
  @ApiResponse({ status: 200, description: 'Tag removed.' })
  async removeTag(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ) {
    return this.productsService.removeTag(id, tagId);
  }

  // ─── Images ───────────────────────────────────────────────────────────────

  @Post(':id/images')
  @HttpCode(HttpStatus.CREATED)
  @Permissions(DefaultPermissions.PRODUCT_UPDATE)
  @ApiOperation({ summary: 'Add an image to a product' })
  @ApiResponse({ status: 201, description: 'Image added.', type: ProductImageResponseDto })
  async addImage(@Body() dto: CreateProductImageDto) {
    return this.productsService.addImage(dto);
  }

  @Get(':id/images')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_VIEW)
  @ApiOperation({ summary: 'Get all images for a product' })
  @ApiResponse({ status: 200, description: 'Images retrieved.' })
  async getImages(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getImages(id);
  }

  @Patch('images/:imageId')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_UPDATE)
  @ApiOperation({ summary: 'Update a product image' })
  @ApiResponse({ status: 200, description: 'Image updated.' })
  async updateImage(
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @Body() dto: UpdateProductImageDto,
  ) {
    return this.productsService.updateImage(imageId, dto);
  }

  @Delete('images/:imageId')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_UPDATE)
  @ApiOperation({ summary: 'Delete a product image' })
  @ApiResponse({ status: 200, description: 'Image deleted.' })
  async removeImage(@Param('imageId', ParseUUIDPipe) imageId: string) {
    return this.productsService.removeImage(imageId);
  }

  @Patch('images/:imageId/primary')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PRODUCT_UPDATE)
  @ApiOperation({ summary: 'Set a product image as primary' })
  @ApiResponse({ status: 200, description: 'Primary image set.' })
  async setPrimaryImage(@Param('imageId', ParseUUIDPipe) imageId: string) {
    return this.productsService.setPrimaryImage(imageId);
  }
}
