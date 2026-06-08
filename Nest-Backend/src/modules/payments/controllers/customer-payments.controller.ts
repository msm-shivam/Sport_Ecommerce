import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { PaymentQueryDto } from '../dto/payment-query.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '../../../common/decorators/api-paginated-response.decorator';

@ApiTags('Customer — Payments')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class CustomerPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my payments' })
  @ApiPaginatedResponse(PaymentResponseDto)
  async getMyPayments(
    @CurrentUser() user: JwtPayload,
    @Query() query: PaymentQueryDto,
  ) {
    return this.paymentsService.getCustomerPayments(user.sub, query);
  }

  @Get('order/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get payment by order' })
  @ApiResponse({
    status: 200,
    description: 'Payment returned.',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  async getOrderPayment(
    @CurrentUser() user: JwtPayload,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    return this.paymentsService.getOrderPayment(orderId);
  }
}
