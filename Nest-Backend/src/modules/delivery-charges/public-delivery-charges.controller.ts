import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { DeliveryChargesService } from './delivery-charges.service';

@ApiTags('Delivery Charges')
@Controller('delivery-charges')
export class PublicDeliveryChargesController {
  constructor(private readonly service: DeliveryChargesService) {}

  @Public()
  @Get('active')
  @HttpCode(HttpStatus.OK)
  async getActive() {
    const charges = await this.service.getActiveCharges();
    return { data: charges };
  }
}
