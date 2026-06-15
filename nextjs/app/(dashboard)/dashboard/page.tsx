'use client';

import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import RevenueChart from '@/components/charts/RevenueChart';
import OrdersChart from '@/components/charts/OrdersChart';
import InventoryChart from '@/components/charts/InventoryChart';
import InventoryOverview from '@/components/inventory/InventoryOverview';
import { useDashboard } from '@/services/endpoints/dashboard.endpoints';
import { DollarSign, ShoppingCart, Package, Users, Ticket, RotateCcw, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: dashboardRes, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Loading metrics..." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = dashboardRes?.data?.metrics;

  const stats = metrics
    ? [
        { title: 'Total Orders', value: metrics.totalOrders.toLocaleString(), icon: ShoppingCart, trend: { value: 0, isPositive: true, label: '' } },
        { title: 'Total Revenue', value: `$${metrics.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: { value: 0, isPositive: true, label: '' } },
        { title: 'Total Customers', value: metrics.totalCustomers.toLocaleString(), icon: Users, trend: { value: 0, isPositive: true, label: '' } },
        { title: 'Total Products', value: metrics.totalProducts.toLocaleString(), icon: Package, trend: { value: 0, isPositive: true, label: '' } },
        { title: 'Open Tickets', value: metrics.openTickets.toLocaleString(), icon: Ticket, trend: { value: 0, isPositive: true, label: '' } },
        { title: 'Pending Returns', value: metrics.pendingReturns.toLocaleString(), icon: RotateCcw, trend: { value: 0, isPositive: true, label: '' } },
        { title: 'Low Stock Products', value: metrics.lowStockProducts.toLocaleString(), icon: AlertTriangle, trend: { value: 0, isPositive: true, label: '' } },
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time performance metrics, graphs, and inventory overview."
      />

      {stats.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <StatsCard key={idx} {...stat} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-zinc-500">No dashboard metrics available</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <InventoryOverview />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <OrdersChart />
        <InventoryChart />
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Recent Orders</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Latest checkout entries</p>
              </div>
              <Link
                href="/orders"
                className="flex items-center gap-0.5 text-xs font-semibold text-orange-600 hover:text-orange-500 hover:underline dark:text-orange-500"
              >
                <span>View all</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-zinc-400 py-4 text-center">Load orders page for details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
