import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MarketingReportService {
  constructor(private readonly dataSource: DataSource) {}

  async getReport(dateFrom?: string, dateTo?: string) {
    const couponQb = this.dataSource
      .createQueryBuilder()
      .select([
        'COUNT(DISTINCT cu.coupon_id)::int as "activeCoupons"',
        'COUNT(cu.id)::int as "totalUses"',
        'COALESCE(SUM(cu.discount_amount), 0) as "totalDiscountGiven"',
      ])
      .from('coupon_usages', 'cu')
      .leftJoin('coupons', 'c', 'c.id = cu.coupon_id');

    if (dateFrom) couponQb.andWhere('c.created_at >= :dateFrom', { dateFrom });
    if (dateTo) couponQb.andWhere('c.created_at <= :dateTo', { dateTo });

    const campaignQb = this.dataSource
      .createQueryBuilder()
      .select([
        'COUNT(*)::int as "totalCampaigns"',
        `COUNT(CASE WHEN c.status = 'SENDING' THEN 1 END)::int as "activeCampaigns"`,
        `COALESCE(SUM(c.opens_count), 0)::int as "totalOpens"`,
        `COALESCE(SUM(c.clicks_count), 0)::int as "totalClicks"`,
        `CASE WHEN COALESCE(SUM(c.opens_count), 0) > 0 THEN ROUND((COALESCE(SUM(c.clicks_count), 0)::decimal / NULLIF(SUM(c.opens_count), 0) * 100)::numeric, 2) ELSE 0 END as "clickRate"`,
      ])
      .from('email_campaigns', 'c');

    if (dateFrom)
      campaignQb.andWhere('c.created_at >= :dateFrom', { dateFrom });
    if (dateTo) campaignQb.andWhere('c.created_at <= :dateTo', { dateTo });

    const [couponUsage, campaigns] = await Promise.all([
      couponQb.getRawOne(),
      campaignQb.getRawOne(),
    ]);

    return {
      data: {
        couponUsage: {
          activeCoupons: parseInt(couponUsage?.activeCoupons ?? '0', 10),
          totalUses: parseInt(couponUsage?.totalUses ?? '0', 10),
          totalDiscountGiven: parseFloat(
            couponUsage?.totalDiscountGiven ?? '0',
          ),
        },
        campaigns: {
          totalCampaigns: parseInt(campaigns?.totalCampaigns ?? '0', 10),
          activeCampaigns: parseInt(campaigns?.activeCampaigns ?? '0', 10),
          totalOpens: parseInt(campaigns?.totalOpens ?? '0', 10),
          totalClicks: parseInt(campaigns?.totalClicks ?? '0', 10),
          clickRate: parseFloat(campaigns?.clickRate ?? '0'),
        },
      },
    };
  }
}
