import { Controller, Get, Query, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { SearchService } from '../services/search.service';
import { SearchSuggestionsService } from '../services/search-suggestions.service';
import { SearchAnalyticsService } from '../services/search-analytics.service';
import { SearchQueryDto } from '../dto/search-query.dto';
import { SearchSuggestionsQueryDto } from '../dto/search-suggestions-query.dto';
import { SearchClickDto } from '../dto/search-click.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RecentSearchQueryDto } from '../dto/recent-search-query.dto';
import { RecentSearch } from '../entities/recent-search.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly searchSuggestionsService: SearchSuggestionsService,
    private readonly searchAnalyticsService: SearchAnalyticsService,
    @InjectRepository(RecentSearch)
    private readonly recentSearchRepo: Repository<RecentSearch>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Global product search with filters' })
  async search(
    @Query() query: SearchQueryDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.id;
    const ipAddress = req.ip;

    const result = await this.searchService.search(query, userId, ipAddress);

    if (query.q && userId) {
      await this.recentSearchRepo
        .createQueryBuilder()
        .insert()
        .into(RecentSearch)
        .values({ userId, keyword: query.q.toLowerCase().trim() })
        .orUpdate(['updated_at'], ['user_id', 'keyword'])
        .execute();

      const count = await this.recentSearchRepo.count({ where: { userId } });
      if (count > 20) {
        const oldest = await this.recentSearchRepo.find({
          where: { userId },
          order: { createdAt: 'ASC' },
          take: count - 20,
        });
        if (oldest.length) {
          await this.recentSearchRepo.remove(oldest);
        }
      }
    }

    return result;
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Search suggestions / autocomplete' })
  async suggestions(@Query() query: SearchSuggestionsQueryDto) {
    const suggestions = await this.searchSuggestionsService.getSuggestions(
      query.q,
      query.limit || 10,
    );
    return { suggestions };
  }

  @Get('trending')
  @ApiOperation({ summary: 'Trending search keywords' })
  async trending() {
    return this.searchAnalyticsService.getTrendingKeywords();
  }

  @Get('filter-options')
  @ApiOperation({ summary: 'Get available filter options' })
  async filterOptions() {
    return this.searchService.getFilterOptions();
  }

  @Get('recent')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get recent searches (customer)' })
  async recentSearches(
    @Req() req: any,
    @Query() query: RecentSearchQueryDto,
  ) {
    const searches = await this.recentSearchRepo.find({
      where: { userId: req.user.id },
      order: { createdAt: 'DESC' },
      take: query.limit || 20,
    });
    return searches.map((s) => s.keyword);
  }

  @Post('click')
  @ApiOperation({ summary: 'Track search result click' })
  async trackClick(@Body() dto: SearchClickDto) {
    await this.searchAnalyticsService.logClick(dto.searchLogId, dto.productId);
    return { message: 'Click tracked' };
  }
}
