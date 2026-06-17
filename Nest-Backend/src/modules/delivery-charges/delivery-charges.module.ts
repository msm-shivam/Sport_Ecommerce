import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryCharge } from './entities/delivery-charge.entity';
import { DeliveryChargeAudit } from './entities/delivery-charge-audit.entity';
import { DeliveryChargesService } from './delivery-charges.service';
import { DeliveryChargesController } from './delivery-charges.controller';
import { PublicDeliveryChargesController } from './public-delivery-charges.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryCharge, DeliveryChargeAudit])],
  controllers: [DeliveryChargesController, PublicDeliveryChargesController],
  providers: [DeliveryChargesService],
  exports: [DeliveryChargesService],
})
export class DeliveryChargesModule {}
