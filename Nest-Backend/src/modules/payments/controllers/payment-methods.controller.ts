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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentMethodsService } from '../services/payment-methods.service';
import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from '../dto/update-payment-method.dto';
import { PaymentMethodResponseDto } from '../dto/payment-method-response.dto';
import { AdminJwtGuard } from '../../../common/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { DefaultPermissions } from '../../../common/constants/roles.constants';

@ApiTags('Admin — Payment Methods')
@ApiBearerAuth('JWT')
@UseGuards(AdminJwtGuard, PermissionsGuard)
@Controller('admin/payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(DefaultPermissions.PAYMENT_METHOD_CREATE)
  @ApiOperation({ summary: 'Create payment method' })
  @ApiResponse({
    status: 201,
    description: 'Payment method created.',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Code already exists.' })
  async create(@Body() dto: CreatePaymentMethodDto) {
    return this.paymentMethodsService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PAYMENT_METHOD_VIEW)
  @ApiOperation({ summary: 'List all payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Payment methods returned.',
    type: [PaymentMethodResponseDto],
  })
  async findAll() {
    return this.paymentMethodsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PAYMENT_METHOD_VIEW)
  @ApiOperation({ summary: 'Get payment method by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment method returned.',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment method not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentMethodsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PAYMENT_METHOD_UPDATE)
  @ApiOperation({ summary: 'Update payment method' })
  @ApiResponse({
    status: 200,
    description: 'Payment method updated.',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment method not found.' })
  @ApiResponse({ status: 409, description: 'Code already exists.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PAYMENT_METHOD_DELETE)
  @ApiOperation({ summary: 'Delete payment method' })
  @ApiResponse({ status: 200, description: 'Payment method deleted.' })
  @ApiResponse({ status: 404, description: 'Payment method not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentMethodsService.remove(id);
  }
}
