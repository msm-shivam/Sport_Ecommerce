import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtGuard } from '../../../common/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { DefaultPermissions } from '../../../common/constants/roles.constants';
import { DashboardService } from '../services/dashboard.service';

@ApiTags('Admin — Dashboards')
@ApiBearerAuth('JWT')
@UseGuards(AdminJwtGuard, PermissionsGuard)
@Controller('admin/dashboards')
export class AdminDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('main')
  @Permissions(DefaultPermissions.DASHBOARD_VIEW)
  async main() {
    return this.dashboardService.getMain();
  }

  @Get('finance')
  @Permissions(DefaultPermissions.DASHBOARD_VIEW)
  async finance() {
    return this.dashboardService.getFinance();
  }

  @Get('inventory')
  @Permissions(DefaultPermissions.DASHBOARD_VIEW)
  async inventory() {
    return this.dashboardService.getInventory();
  }

  @Get('support')
  @Permissions(DefaultPermissions.DASHBOARD_VIEW)
  async support() {
    return this.dashboardService.getSupport();
  }

  @Get('marketing')
  @Permissions(DefaultPermissions.DASHBOARD_VIEW)
  async marketing() {
    return this.dashboardService.getMarketing();
  }
}
