import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeliverySettingsService } from './delivery-settings.service';
import { UpdateDeliverySettingDto } from './dto/update-delivery-setting.dto';
import { DeliverySettingResponseDto } from './dto/delivery-setting-response.dto';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { DefaultPermissions } from '../../common/constants/roles.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Admin — Delivery Settings')
@ApiBearerAuth('JWT')
@UseGuards(AdminJwtGuard, PermissionsGuard)
@Controller('admin/delivery-settings')
export class DeliverySettingsController {
  constructor(
    private readonly deliverySettingsService: DeliverySettingsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.DELIVERY_MANAGE)
  @ApiOperation({ summary: 'Get delivery settings' })
  @ApiResponse({
    status: 200,
    description: 'Delivery settings returned.',
    type: DeliverySettingResponseDto,
  })
  async get() {
    return this.deliverySettingsService.getActive();
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.DELIVERY_MANAGE)
  @ApiOperation({ summary: 'Update delivery settings' })
  @ApiResponse({
    status: 200,
    description: 'Delivery settings updated.',
    type: DeliverySettingResponseDto,
  })
  async update(
    @Body() dto: UpdateDeliverySettingDto,
    @CurrentUser() admin: JwtPayload,
  ) {
    return this.deliverySettingsService.update(dto, admin.sub);
  }
}
