import { Controller, Get, Patch, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtGuard } from '../../../common/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { DefaultPermissions } from '../../../common/constants/roles.constants';
import { SystemSettingsService } from '../services/system-settings.service';
import type { UpdateSettingsDto } from '../dto/update-settings.dto';

@ApiTags('Admin — Settings')
@ApiBearerAuth('JWT')
@UseGuards(AdminJwtGuard, PermissionsGuard)
@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly settingsService: SystemSettingsService) {}

  @Get()
  @Permissions(DefaultPermissions.SETTINGS_VIEW)
  async findAll(@Query('category') category?: string) {
    return this.settingsService.findAll(category);
  }

  @Patch()
  @Permissions(DefaultPermissions.SETTINGS_MANAGE)
  async upsert(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.upsert(dto.settings ?? {});
  }
}
