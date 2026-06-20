import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { DefaultPermissions } from '../../common/constants/roles.constants';
import { UsersService } from './users.service';
import { AdminCustomerQueryDto } from './dto/admin-customer-query.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AppValidationPipe } from '../../common/pipes/validation.pipe';

@ApiTags('Admin — Customers')
@ApiBearerAuth('JWT')
@UseGuards(AdminJwtGuard, PermissionsGuard)
@Controller('admin/customers')
export class AdminCustomersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions(DefaultPermissions.CUSTOMER_VIEW)
  @ApiOperation({ summary: 'List all customers with search, filters, and pagination' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by first name' })
  @ApiQuery({ name: 'isActive', required: false, enum: ['true', 'false'] })
  @ApiQuery({ name: 'isEmailVerified', required: false, enum: ['true', 'false'] })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Filter by registration date (start)' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Filter by registration date (end)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'firstName', 'lastName', 'email'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of customers' })
  @ApiResponse({ status: 403, description: 'Forbidden — missing customer.view permission' })
  async findAll(@Query(AppValidationPipe) query: AdminCustomerQueryDto) {
    return this.usersService.findAllCustomers(query);
  }

  @Get('stats')
  @Permissions(DefaultPermissions.CUSTOMER_STATS)
  @ApiOperation({ summary: 'Get customer stats (total, active, verified, new this month, new today)' })
  @ApiResponse({ status: 200, description: 'Customer statistics' })
  @ApiResponse({ status: 403, description: 'Forbidden — missing customer.stats permission' })
  async getStats() {
    return this.usersService.getCustomerStats();
  }

  @Get(':id')
  @Permissions(DefaultPermissions.CUSTOMER_VIEW)
  @ApiOperation({ summary: 'Get single customer details' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Customer user UUID' })
  @ApiResponse({ status: 200, description: 'Customer details', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.usersService.getProfile(id);
  }

  @Patch(':id/toggle-active')
  @Permissions(DefaultPermissions.CUSTOMER_VIEW)
  @ApiOperation({ summary: 'Toggle customer active/inactive status' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Customer user UUID' })
  @ApiResponse({ status: 200, description: 'Customer status toggled' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async toggleActive(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.toggleCustomerActive(id);
  }

  @Delete(':id')
  @Permissions(DefaultPermissions.CUSTOMER_VIEW)
  @ApiOperation({ summary: 'Soft delete a customer' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', description: 'Customer user UUID' })
  @ApiResponse({ status: 200, description: 'Customer deleted' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteCustomer(id);
  }
}
