import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CmsPage } from '../entities/cms-page.entity';
import { CmsPageStatus } from '../enums/cms-page-status.enum';
import { CreateCmsPageDto } from '../dto/create-cms-page.dto';
import { UpdateCmsPageDto } from '../dto/update-cms-page.dto';
import { CmsPageQueryDto } from '../dto/cms-page-query.dto';
import { paginate } from '../../../common/utils/pagination.util';

@Injectable()
export class CmsPageService {
  constructor(
    @InjectRepository(CmsPage)
    private readonly cmsPageRepo: Repository<CmsPage>,
  ) {}

  async create(dto: CreateCmsPageDto): Promise<CmsPage> {
    const page = this.cmsPageRepo.create(dto);
    return this.cmsPageRepo.save(page);
  }

  async findAll(query: CmsPageQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.pageType) where.pageType = query.pageType;
    if (query.search) where.title = ILike(`%${query.search}%`);

    const [data, total] = await this.cmsPageRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const [totalPages, published, draft] = await Promise.all([
      this.cmsPageRepo.count(),
      this.cmsPageRepo.count({ where: { status: CmsPageStatus.PUBLISHED } }),
      this.cmsPageRepo.count({ where: { status: CmsPageStatus.DRAFT } }),
    ]);

    return {
      ...paginate(data, total, page, limit),
      totalPages,
      published,
      draft,
    };
  }

  async findOne(id: string): Promise<CmsPage> {
    const page = await this.cmsPageRepo.findOne({ where: { id } });
    if (!page) throw new NotFoundException('CMS page not found');
    return page;
  }

  async findBySlug(slug: string): Promise<CmsPage | null> {
    return this.cmsPageRepo.findOne({
      where: { slug, status: CmsPageStatus.PUBLISHED },
    });
  }

  async update(id: string, dto: UpdateCmsPageDto): Promise<CmsPage> {
    const page = await this.findOne(id);
    Object.assign(page, dto);
    return this.cmsPageRepo.save(page);
  }

  async remove(id: string): Promise<void> {
    const page = await this.findOne(id);
    await this.cmsPageRepo.remove(page);
  }
}
