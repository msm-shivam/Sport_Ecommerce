import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SupportReportService {
  constructor(private readonly dataSource: DataSource) {}

  async getReport(dateFrom?: string, dateTo?: string) {
    const qb = this.dataSource
      .createQueryBuilder()
      .select([
        'COUNT(*)::int as "totalTickets"',
        `COUNT(CASE WHEN t.status = 'OPEN' THEN 1 END)::int as "openTickets"`,
        `COUNT(CASE WHEN t.status = 'RESOLVED' THEN 1 END)::int as "resolvedTickets"`,
        `COUNT(CASE WHEN t.status = 'CLOSED' THEN 1 END)::int as "closedTickets"`,
        `ROUND(COALESCE(AVG(CASE WHEN t.resolved_at IS NOT NULL THEN EXTRACT(EPOCH FROM (t.resolved_at - t.created_at)) / 3600 END), 0)::numeric, 2) as "avgResolutionHours"`,
        `CASE WHEN COUNT(*) > 0 THEN ROUND((COUNT(CASE WHEN t.status IN ('RESOLVED','CLOSED') THEN 1 END)::decimal / COUNT(*) * 100)::numeric, 2) ELSE 0 END as "resolutionRate"`,
      ])
      .from('support_tickets', 't');

    if (dateFrom) qb.andWhere('t.created_at >= :dateFrom', { dateFrom });
    if (dateTo) qb.andWhere('t.created_at <= :dateTo', { dateTo });

    const summary = await qb.getRawOne();

    const priorityQb = this.dataSource
      .createQueryBuilder()
      .select(['t.priority as "priority"', 'COUNT(*)::int as "count"'])
      .from('support_tickets', 't');

    if (dateFrom)
      priorityQb.andWhere('t.created_at >= :dateFrom', { dateFrom });
    if (dateTo) priorityQb.andWhere('t.created_at <= :dateTo', { dateTo });

    priorityQb.groupBy('t.priority').orderBy('t.priority');

    const byPriorityRaw = await priorityQb.getRawMany();
    const byPriority = byPriorityRaw.map((p) => ({
      priority: p.priority,
      count: parseInt(p.count, 10),
    }));

    return {
      data: {
        totalTickets: parseInt(summary?.totalTickets ?? '0', 10),
        openTickets: parseInt(summary?.openTickets ?? '0', 10),
        resolvedTickets: parseInt(summary?.resolvedTickets ?? '0', 10),
        closedTickets: parseInt(summary?.closedTickets ?? '0', 10),
        avgResolutionHours: parseFloat(summary?.avgResolutionHours ?? '0'),
        resolutionRate: parseFloat(summary?.resolutionRate ?? '0'),
        byPriority,
      },
    };
  }
}
