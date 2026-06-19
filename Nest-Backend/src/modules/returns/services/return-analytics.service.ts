/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReturnRequest } from '../entities/return-request.entity';
import { ReturnItem } from '../entities/return-item.entity';
import { ReturnRequestStatus } from '../enums/return-request-status.enum';

@Injectable()
export class ReturnAnalyticsService {
  constructor(
    @InjectRepository(ReturnRequest)
    private readonly returnRepo: Repository<ReturnRequest>,
    @InjectRepository(ReturnItem)
    private readonly returnItemRepo: Repository<ReturnItem>,
  ) {}

  async getSummary() {
    const totalReturns = await this.returnRepo.count();
    const totalRefundAmount = await this.returnRepo
      .createQueryBuilder('r')
      .select('COALESCE(SUM(r.totalRefundAmount), 0)', 'total')
      .getRawOne();

    const pendingCount = await this.returnRepo.count({
      where: { status: ReturnRequestStatus.REQUESTED },
    });
    const approvedCount = await this.returnRepo.count({
      where: { status: ReturnRequestStatus.APPROVED },
    });
    const rejectedCount = await this.returnRepo.count({
      where: { status: ReturnRequestStatus.REJECTED },
    });
    const refundedCount = await this.returnRepo.count({
      where: { status: ReturnRequestStatus.REFUNDED },
    });

    const avgProcessingTime = await this.returnRepo
      .createQueryBuilder('r')
      .select(
        'AVG(EXTRACT(EPOCH FROM (r.completed_at - r.requested_at)) / 3600)',
        'avgHours',
      )
      .where('r.completed_at IS NOT NULL')
      .getRawOne();

    return {
      totalReturns,
      totalRefundAmount: Number(totalRefundAmount?.total || 0),
      returnRate: 0,
      averageProcessingTimeHours: Math.round(
        Number(avgProcessingTime?.avgHours || 0),
      ),
      pendingReturns: pendingCount,
      approvedReturns: approvedCount,
      rejectedReturns: rejectedCount,
      refundedReturns: refundedCount,
    };
  }

  async getReturnReasons() {
    return this.returnRepo
      .createQueryBuilder('r')
      .select('r.reason', 'reason')
      .addSelect('COUNT(*)', 'count')
      .groupBy('r.reason')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  async getReturnedProducts(limit = 20) {
    /*
     * For each product+variant combination we compute:
     *  - productName      : product name (live from products table, fallback to snapshot)
     *  - variantName      : variant SKU  (from product_variants)
     *  - returnCount      : distinct return requests that included this variant
     *  - totalReturnedQty : sum of returned quantities
     *  - totalSoldQty     : total qty ever sold for this variant across all orders
     *  - projectedAmount  : unit_price × returnedQty  (what customers paid for returned items)
     *  - revenueLoss      : actual refund_amount paid out
     *  - returnRate       : (totalReturnedQty / totalSoldQty) × 100  (%)
     */
    const rows = await this.returnItemRepo
      .createQueryBuilder('ri')
      .innerJoin('ri.orderItem', 'oi')
      .leftJoin('oi.variant', 'pv')
      .leftJoin('pv.product', 'p')
      // ── Selections ──────────────────────────────────────────────
      .select('oi.productId', 'productId')
      .addSelect('oi.variantId', 'variantId')
      .addSelect('COALESCE(p.name, oi.productName)', 'productName')
      .addSelect('pv.sku', 'variantSku')
      .addSelect('COUNT(DISTINCT ri.returnRequestId)', 'returnCount')
      .addSelect('SUM(ri.quantity)', 'totalReturnedQty')
      .addSelect('COALESCE(SUM(ri.refundAmount), 0)', 'revenueLoss')
      .addSelect('SUM(oi.unitPrice * ri.quantity)', 'projectedAmount')
      // Total qty ever sold for this variant (correlated subquery)
      .addSelect(
        `(
          SELECT COALESCE(SUM(oi2.quantity), 0)
          FROM order_items oi2
          WHERE oi2.variant_id = oi.variant_id
        )`,
        'totalSoldQty',
      )
      // ── Grouping & ordering ──────────────────────────────────────
      .groupBy('oi.productId')
      .addGroupBy('oi.variantId')
      .addGroupBy('p.name')
      .addGroupBy('oi.productName')
      .addGroupBy('pv.sku')
      .orderBy('"returnCount"', 'DESC')
      .limit(limit)
      .getRawMany<{
        productId: string;
        variantId: string;
        productName: string;
        variantSku: string;
        returnCount: string;
        totalReturnedQty: string;
        revenueLoss: string;
        projectedAmount: string;
        totalSoldQty: string;
      }>();

    return rows.map((row) => {
      const totalReturnedQty = Number(row.totalReturnedQty || 0);
      const totalSoldQty = Number(row.totalSoldQty || 0);
      const returnRate =
        totalSoldQty > 0
          ? parseFloat(((totalReturnedQty / totalSoldQty) * 100).toFixed(2))
          : 0;

      return {
        productId: row.productId,
        variantId: row.variantId,
        productName: row.productName,
        variantName: row.variantSku,
        returnCount: Number(row.returnCount),
        totalReturnedQty,
        totalSoldQty,
        projectedAmount: parseFloat(
          Number(row.projectedAmount || 0).toFixed(2),
        ),
        revenueLoss: parseFloat(Number(row.revenueLoss || 0).toFixed(2)),
        returnRate,
      };
    });
  }

  async getRefundAnalytics() {
    const monthlyRefunds = await this.returnRepo
      .createQueryBuilder('r')
      .select("TO_CHAR(r.requested_at, 'YYYY-MM')", 'month')
      .addSelect('SUM(r.totalRefundAmount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('r.status IN (:...statuses)', {
        statuses: [ReturnRequestStatus.REFUNDED, ReturnRequestStatus.COMPLETED],
      })
      .groupBy("TO_CHAR(r.requested_at, 'YYYY-MM')")
      .orderBy('month', 'DESC')
      .limit(12)
      .getRawMany();

    return { monthlyRefunds };
  }
}
