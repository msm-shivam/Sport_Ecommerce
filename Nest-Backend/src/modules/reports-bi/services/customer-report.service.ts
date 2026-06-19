import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CustomerReportService {
  constructor(private readonly dataSource: DataSource) {}

  async getReport(dateFrom?: string, dateTo?: string) {
    // 1. New Customers
    const newCustQb = this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)::int', 'count')
      .from('users', 'u');
    if (dateFrom) newCustQb.andWhere('u.created_at >= :dateFrom', { dateFrom });
    if (dateTo) newCustQb.andWhere('u.created_at <= :dateTo', { dateTo });
    const newCustomers = await newCustQb.getRawOne();

    // 2. Repeat Customers
    const repeatCustQb = this.dataSource
      .createQueryBuilder()
      .select('o.user_id') // It's user_id in orders table, not customer_id
      .from('orders', 'o')
      .where('o.status NOT IN (:...excluded)', { excluded: ['CANCELLED'] })
      .groupBy('o.user_id')
      .having('COUNT(o.id) > 1');

    if (dateFrom)
      repeatCustQb.andWhere('o.created_at >= :dateFrom', { dateFrom });
    if (dateTo) repeatCustQb.andWhere('o.created_at <= :dateTo', { dateTo });

    const repeatCustomersCount = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)::int', 'count')
      .from(`(${repeatCustQb.getQuery()})`, 'repeat')
      .setParameters(repeatCustQb.getParameters())
      .getRawOne();

    // 3. Top Spenders
    const topSpendersQb = this.dataSource
      .createQueryBuilder()
      .select([
        'o.user_id as "customerId"',
        `u.first_name || ' ' || u.last_name as "customerName"`,
        'COUNT(o.id)::int as "orderCount"',
        'COALESCE(SUM(o.total_amount), 0) as "totalSpent"',
      ])
      .from('orders', 'o')
      .leftJoin('users', 'u', 'u.id = o.user_id')
      .where('o.status NOT IN (:...excluded)', { excluded: ['CANCELLED'] })
      .groupBy('o.user_id, u.first_name, u.last_name')
      .orderBy('"totalSpent"', 'DESC')
      .limit(10);

    if (dateFrom)
      topSpendersQb.andWhere('o.created_at >= :dateFrom', { dateFrom });
    if (dateTo) topSpendersQb.andWhere('o.created_at <= :dateTo', { dateTo });

    const topSpendersRaw = await topSpendersQb.getRawMany();
    const topSpenders = topSpendersRaw.map((ts) => ({
      ...ts,
      orderCount: parseInt(ts.orderCount, 10),
      totalSpent: parseFloat(ts.totalSpent),
    }));

    // 4. Total Customers
    const totalCustomers = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)::int', 'count')
      .from('users', 'u')
      .getRawOne();

    return {
      data: {
        newCustomers: parseInt(newCustomers?.count ?? '0', 10),
        repeatCustomers: parseInt(repeatCustomersCount?.count ?? '0', 10),
        topSpenders,
        totalCustomers: parseInt(totalCustomers?.count ?? '0', 10),
      },
    };
  }
}
