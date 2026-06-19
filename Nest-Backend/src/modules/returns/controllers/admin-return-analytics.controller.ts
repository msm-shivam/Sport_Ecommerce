import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminJwtGuard } from '../../../common/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { DefaultPermissions } from '../../../common/constants/roles.constants';
import { ReturnAnalyticsService } from '../services/return-analytics.service';

@ApiTags('Admin — Return Analytics')
@ApiBearerAuth('JWT')
@UseGuards(AdminJwtGuard, PermissionsGuard)
@Controller('admin/return-analytics')
export class AdminReturnAnalyticsController {
  constructor(private readonly analyticsService: ReturnAnalyticsService) {}

  @Get('summary')
  @Permissions(DefaultPermissions.RETURN_VIEW)
  async getSummary() {
    return this.analyticsService.getSummary();
  }

  @Get('reasons')
  @Permissions(DefaultPermissions.RETURN_VIEW)
  async getReasons() {
    return this.analyticsService.getReturnReasons();
  }

  @Get('products')
  @Permissions(DefaultPermissions.RETURN_VIEW)
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max rows to return (default 20, max 100)' })
  async getProducts(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    return this.analyticsService.getReturnedProducts(safeLimit);
  }

  @Get('refunds')
  @Permissions(DefaultPermissions.RETURN_VIEW)
  async getRefunds() {
    return this.analyticsService.getRefundAnalytics();
  }
}
