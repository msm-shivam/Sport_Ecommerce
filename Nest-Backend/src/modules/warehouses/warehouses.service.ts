import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly repo: Repository<Warehouse>,
  ) {}

  async create(dto: CreateWarehouseDto) {
    const existing = await this.repo.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException(
        `Warehouse code "${dto.code}" already exists`,
      );
    }
    const warehouse = this.repo.create(dto);
    return this.repo.save(warehouse);
  }

  async findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const warehouse = await this.repo.findOne({ where: { id } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return warehouse;
  }

  async update(id: string, dto: UpdateWarehouseDto) {
    const warehouse = await this.findOne(id);
    if (dto.code && dto.code !== warehouse.code) {
      const existing = await this.repo.findOne({ where: { code: dto.code } });
      if (existing) {
        throw new ConflictException(
          `Warehouse code "${dto.code}" already exists`,
        );
      }
    }
    Object.assign(warehouse, dto);
    return this.repo.save(warehouse);
  }

  async remove(id: string) {
    const warehouse = await this.findOne(id);
    await this.repo.softRemove(warehouse);
    return { message: 'Warehouse deleted successfully.' };
  }

  async findNearest(lat: number, lng: number): Promise<Warehouse> {
    const warehouses = await this.repo.find({
      where: { isActive: true },
    });
    if (warehouses.length === 0) {
      throw new NotFoundException('No active warehouses found');
    }

    let nearest = warehouses[0];
    let minDistance = this.haversine(
      lat,
      lng,
      nearest.latitude,
      nearest.longitude,
    );

    for (let i = 1; i < warehouses.length; i++) {
      const dist = this.haversine(
        lat,
        lng,
        warehouses[i].latitude,
        warehouses[i].longitude,
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearest = warehouses[i];
      }
    }

    return nearest;
  }

  private haversine(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }
}
