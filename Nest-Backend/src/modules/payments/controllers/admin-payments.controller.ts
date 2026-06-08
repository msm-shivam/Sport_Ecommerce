import {
  Body,
  Controller,
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
import { PaymentsService } from '../services/payments.service';
import { RefundsService } from '../services/refunds.service';
import { CreateRefundDto } from '../dto/create-refund.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentQueryDto } from '../dto/payment-query.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { RefundResponseDto } from '../dto/refund-response.dto';
import { AdminJwtGuard } from '../../../common/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { DefaultPermissions } from '../../../common/constants/roles.constants';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '../../../common/decorators/api-paginated-response.decorator';

@ApiTags('Admin — Payments')
@ApiBearerAuth('JWT')
@UseGuards(AdminJwtGuard, PermissionsGuard)
@Controller('admin/payments')
export class AdminPaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly refundsService: RefundsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PAYMENT_VIEW)
  @ApiOperation({ summary: 'List all payments' })
  @ApiPaginatedResponse(PaymentResponseDto)
  async getAllPayments(@Query() query: PaymentQueryDto) {
    return this.paymentsService.getAllPayments(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PAYMENT_VIEW)
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment returned.',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  async getPayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.getPayment(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.PAYMENT_UPDATE)
  @ApiOperation({ summary: 'Update payment notes' })
  @ApiResponse({
    status: 200,
    description: 'Payment updated.',
    type: PaymentResponseDto,
  })
  async updatePayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentsService.updatePayment(id, dto);
  }

  @Post(':id/refund')
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.REFUND_CREATE)
  @ApiOperation({ summary: 'Refund payment (full or partial)' })
  @ApiResponse({
    status: 200,
    description: 'Refund processed.',
    type: RefundResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  @ApiResponse({ status: 400, description: 'Refund validation error.' })
  async refundPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateRefundDto,
    @CurrentUser() admin: JwtPayload,
  ) {
    return this.refundsService.createRefund(id, dto, admin.sub);
  }
}
