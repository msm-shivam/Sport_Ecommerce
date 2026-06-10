import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DiscoveryService } from '../services/discovery.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Discovery')
@Controller('discovery')
export class DiscoveryController {
  constructor(
    private readonly discoveryService: DiscoveryService,
  ) {}

  @Get('related/:productId')
  @ApiOperation({ summary: 'Get related products' })
  async related(
    @Param('productId') productId: string,
    @Query('limit') limit?: number,
  ) {
    return this.discoveryService.getRelatedProducts(productId, limit);
  }

  @Get('also-viewed/:productId')
  @ApiOperation({ summary: 'Get customers also viewed' })
  async alsoViewed(
    @Param('productId') productId: string,
    @Query('limit') limit?: number,
  ) {
    return this.discoveryService.getAlsoViewed(productId, limit);
  }

  @Get('frequently-bought/:productId')
  @ApiOperation({ summary: 'Get frequently bought together' })
  async frequentlyBought(
    @Param('productId') productId: string,
    @Query('limit') limit?: number,
  ) {
    return this.discoveryService.getFrequentlyBought(productId, limit);
  }

  @Get('trending-products')
  @ApiOperation({ summary: 'Get trending products' })
  async trendingProducts(@Query('limit') limit?: number) {
    return this.discoveryService.getTrendingProducts(limit);
  }

  @Get('featured-products')
  @ApiOperation({ summary: 'Get featured products' })
  async featuredProducts(@Query('limit') limit?: number) {
    return this.discoveryService.getFeaturedProducts(limit);
  }

  @Get('new-arrivals')
  @ApiOperation({ summary: 'Get new arrivals' })
  async newArrivals(@Query('limit') limit?: number) {
    return this.discoveryService.getNewArrivals(limit);
  }

  @Get('recently-viewed')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get recently viewed products (customer)' })
  async recentlyViewed(
    @Req() req: any,
    @Query('limit') limit?: number,
  ) {
    return this.discoveryService.getRecentlyViewed(req.user.id, limit);
  }

  @Get('record-view/:productId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Record a product view' })
  async recordView(
    @Req() req: any,
    @Param('productId') productId: string,
  ) {
    await this.discoveryService.recordView(req.user.id, productId);
    return { message: 'View recorded' };
  }
}
