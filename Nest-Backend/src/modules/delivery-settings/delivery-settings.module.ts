import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverySetting } from './entities/delivery-setting.entity';
import { DeliverySettingsService } from './delivery-settings.service';
import { DeliverySettingsController } from './delivery-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliverySetting])],
  controllers: [DeliverySettingsController],
  providers: [DeliverySettingsService],
  exports: [DeliverySettingsService],
})
export class DeliverySettingsModule {}
