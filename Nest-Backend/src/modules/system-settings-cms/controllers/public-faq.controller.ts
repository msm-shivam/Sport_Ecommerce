import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FaqService } from '../services/faq.service';
import { FaqQueryDto } from '../dto/faq-query.dto';

@ApiTags('Public — FAQ')
@Controller('content/faqs')
export class PublicFaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  @ApiOperation({ summary: 'Get published FAQs' })
  async findAll(@Query() query: FaqQueryDto) {
    query.isActive = true;
    return this.faqService.findAll(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get FAQ categories' })
  async getCategories() {
    const categories = await this.faqService.getCategories();
    return { data: categories };
  }
}
