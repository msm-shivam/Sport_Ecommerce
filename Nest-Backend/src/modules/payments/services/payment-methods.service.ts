import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../entities/payment-method.entity';
import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from '../dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly repo: Repository<PaymentMethod>,
  ) {}

  async create(dto: CreatePaymentMethodDto) {
    const existing = await this.repo.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException(
        `Payment method with code "${dto.code}" already exists`,
      );
    }

    const method = this.repo.create({
      name: dto.name,
      code: dto.code,
      description: dto.description ?? null,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });
    return this.repo.save(method);
  }

  async findAll() {
    return this.repo.find({ order: { sortOrder: 'ASC' } });
  }

  async findOne(id: string) {
    const method = await this.repo.findOne({ where: { id } });
    if (!method) {
      throw new NotFoundException('Payment method not found');
    }
    return method;
  }

  async update(id: string, dto: UpdatePaymentMethodDto) {
    const method = await this.findOne(id);
    if (dto.code && dto.code !== method.code) {
      const existing = await this.repo.findOne({ where: { code: dto.code } });
      if (existing) {
        throw new ConflictException(
          `Payment method with code "${dto.code}" already exists`,
        );
      }
    }
    Object.assign(method, dto);
    return this.repo.save(method);
  }

  async remove(id: string) {
    const method = await this.findOne(id);
    await this.repo.remove(method);
    return { message: 'Payment method deleted successfully.' };
  }
}
