import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CmsPageService } from '../services/cms-page.service';
import { HomepageService } from '../services/homepage.service';
import { ContactSettingsService } from '../services/contact-settings.service';

@ApiTags('Public — Content')
@Controller('content')
export class PublicContentController {
  constructor(
    private readonly cmsPageService: CmsPageService,
    private readonly homepageService: HomepageService,
    private readonly contactSettingsService: ContactSettingsService,
  ) {}

  @Get('pages/:slug')
  async getPage(@Param('slug') slug: string) {
    const page = await this.cmsPageService.findBySlug(slug);
    if (!page) return { data: null };
    return { data: page };
  }

  @Get('homepage')
  async getHomepage() {
    const sections = await this.homepageService.findAll();
    return { data: sections };
  }

  @Get('contact')
  async getContact() {
    const contact = await this.contactSettingsService.find();
    return { data: contact };
  }
}
