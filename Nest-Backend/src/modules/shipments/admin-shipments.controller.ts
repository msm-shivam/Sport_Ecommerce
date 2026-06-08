import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { ShipmentQueryDto } from './dto/shipment-query.dto';
import { ShipmentResponseDto } from './dto/shipment-response.dto';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { DefaultPermissions } from '../../common/constants/roles.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('Admin — Shipments')
@ApiBearerAuth('JWT')
@UseGuards(AdminJwtGuard, PermissionsGuard)
@Controller('admin/shipments')
export class AdminShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.SHIPMENT_VIEW)
  @ApiOperation({ summary: 'List all shipments' })
  @ApiPaginatedResponse(ShipmentResponseDto)
  async findAll(@Query() query: ShipmentQueryDto) {
    return this.shipmentsService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.SHIPMENT_VIEW)
  @ApiOperation({ summary: 'Get shipment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Shipment returned.',
    type: ShipmentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Shipment not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.shipmentsService.findOne(id);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.SHIPMENT_UPDATE)
  @ApiOperation({ summary: 'Update shipment status' })
  @ApiResponse({
    status: 200,
    description: 'Shipment status updated.',
    type: ShipmentResponseDto,
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateShipmentStatusDto,
    @CurrentUser() admin: JwtPayload,
  ) {
    return this.shipmentsService.updateStatus(id, dto, admin.sub);
  }
}
