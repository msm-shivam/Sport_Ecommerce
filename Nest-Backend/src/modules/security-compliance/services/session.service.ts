import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { SecuritySession } from '../entities/security-session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SecuritySession)
    private readonly sessionRepo: Repository<SecuritySession>,
  ) {}

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.sessionRepo.findAndCount({
      where: { revokedAt: IsNull() },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async revoke(id: string): Promise<SecuritySession> {
    const session = await this.sessionRepo.findOne({ where: { id } });
    if (!session) throw new NotFoundException('Session not found');
    session.revokedAt = new Date();
    return this.sessionRepo.save(session);
  }
}
