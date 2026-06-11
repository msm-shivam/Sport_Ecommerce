import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from '../entities/system-setting.entity';

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectRepository(SystemSetting)
    private readonly settingRepo: Repository<SystemSetting>,
  ) {}

  async findAll(category?: string) {
    const where = category ? { category } : {};
    return this.settingRepo.find({ where, order: { key: 'ASC' } });
  }

  async findByKey(key: string): Promise<SystemSetting | null> {
    return this.settingRepo.findOne({ where: { key } });
  }

  async upsert(settings: Record<string, string>) {
    for (const [key, value] of Object.entries(settings)) {
      let setting = await this.settingRepo.findOne({ where: { key } });
      if (!setting) {
        setting = this.settingRepo.create({ key, value });
      } else {
        setting.value = value;
      }
      await this.settingRepo.save(setting);
    }
    return this.findAll();
  }
}
