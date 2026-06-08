import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliverySetting } from './entities/delivery-setting.entity';
import { UpdateDeliverySettingDto } from './dto/update-delivery-setting.dto';

@Injectable()
export class DeliverySettingsService {
  constructor(
    @InjectRepository(DeliverySetting)
    private readonly repo: Repository<DeliverySetting>,
  ) {}

  async getOrCreate(): Promise<DeliverySetting> {
    let settings = await this.repo.findOne({ where: { isActive: true } });
    if (!settings) {
      settings = this.repo.create({
        perKmCharge: 0,
        freeShippingThreshold: 0,
        maxDeliveryDistanceKm: 0,
        isActive: true,
      });
      settings = await this.repo.save(settings);
    }
    return settings;
  }

  async getActive() {
    const settings = await this.getOrCreate();
    if (!settings.isActive) {
      throw new NotFoundException('No active delivery settings found');
    }
    return settings;
  }

  async update(dto: UpdateDeliverySettingDto, updatedBy: string) {
    const settings = await this.getOrCreate();
    Object.assign(settings, dto, { updatedBy });
    return this.repo.save(settings);
  }

  calculateCharge(
    distanceKm: number,
    orderAmount: number,
    settings: DeliverySetting,
  ): number {
    if (
      settings.freeShippingThreshold > 0 &&
      orderAmount >= Number(settings.freeShippingThreshold)
    ) {
      return 0;
    }

    return distanceKm * Number(settings.perKmCharge);
  }

  isServiceable(distanceKm: number, settings: DeliverySetting): boolean {
    if (
      settings.maxDeliveryDistanceKm > 0 &&
      distanceKm > Number(settings.maxDeliveryDistanceKm)
    ) {
      return false;
    }
    return true;
  }
}
