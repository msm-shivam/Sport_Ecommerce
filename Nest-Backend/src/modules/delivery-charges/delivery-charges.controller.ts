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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { DefaultPermissions } from '../../common/constants/roles.constants';
import { DeliveryChargesService } from './delivery-charges.service';
import { CreateDeliveryChargeDto } from './dto/create-delivery-charge.dto';
import { UpdateDeliveryChargeDto } from './dto/update-delivery-charge.dto';
import { DeliveryChargeQueryDto } from './dto/delivery-charge-query.dto';

@ApiTags('Admin — Delivery Charges')
@ApiBearerAuth('JWT')
@UseGuards(AdminJwtGuard, PermissionsGuard)
@Controller('admin/delivery-charges')
export class DeliveryChargesController {
  constructor(private readonly service: DeliveryChargesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(DefaultPermissions.DELIVERY_CHARGE_MANAGE)
  async create(@Body() dto: CreateDeliveryChargeDto, @CurrentUser() admin: JwtPayload) {
    return this.service.create(dto, admin.sub);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.DELIVERY_CHARGE_VIEW)
  async findAll(@Query() query: DeliveryChargeQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.DELIVERY_CHARGE_VIEW)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.DELIVERY_CHARGE_MANAGE)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDeliveryChargeDto, @CurrentUser() admin: JwtPayload) {
    return this.service.update(id, dto, admin.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.DELIVERY_CHARGE_MANAGE)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }

  @Patch(':id/toggle')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.DELIVERY_CHARGE_MANAGE)
  async toggleActive(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() admin: JwtPayload) {
    return this.service.toggleActive(id, admin.sub);
  }

  @Get(':id/history')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.DELIVERY_CHARGE_VIEW)
  async getHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getHistory(id);
  }
}
