import { prisma } from '@/lib/prisma';
import { Bike, FileText, Wallet } from 'lucide-react';
import DashboardSearch from '@/components/DashboardSearch';
import ThemeToggle from '@/components/ThemeToggle';
import UserMenu from '@/components/UserMenu';
import NotificationBell from '@/components/NotificationBell';
import { unstable_cache } from 'next/cache';
import HeroStats from './components/dashboard/HeroStats';
import StatCard from './components/dashboard/StatCard';
import RecentImports from './components/dashboard/RecentImports';

const getDashboardStats = unstable_cache(
    async () => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [
            carsInStock,
            overdueDocs,
            pendingExpenses,
            recentSales,
            recentImports,
            recentExpenses
        ] = await Promise.all([
            prisma.xeMuaVao.count({ where: { trangThai: { notIn: ['DA_BAN', 'HUY_GIAO_DICH'] } } }),
            prisma.hoSoXe.count({ where: { trangThai: 'QUA_HAN' } }),
            prisma.chiPhiXe.count({ where: { trangThai: 'CHO_DUYET' } }),
            prisma.xeBanRa.findMany({
                where: { ngayBan: { gte: sevenDaysAgo } },
                select: { ngayBan: true, giaBan: true }
            }),
            prisma.xeMuaVao.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { id: true, dongXe: true, bienSo: true, trangThai: true, createdAt: true, tongGiaMua: true, hinhAnh: true }
            }),
            prisma.xeMuaVao.findMany({
                where: { createdAt: { gte: sevenDaysAgo } },
                select: { createdAt: true, tongGiaMua: true }
            })
        ]);

        return {
            carsInStock,
            overdueDocs,
            pendingExpenses,
            recentSales,
            recentImports,
            recentExpenses
        };
    },
    ['dashboard-stats'],
    { revalidate: 60, tags: ['dashboard'] } // Increased revalidate to 60s for better performance
);

export default async function DashboardPage() {
  const {
    carsInStock,
    overdueDocs,
    pendingExpenses,
    recentSales,
    recentImports,
    recentExpenses
  } = await getDashboardStats();

  // Optimized Data Processing
  const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toISOString().split('T')[0];
      
      // Revenue (Sales)
      const daySales = recentSales.filter(s => new Date(s.ngayBan).toISOString().split('T')[0] === dayStr);
      const totalRevenue = daySales.reduce((sum, s) => sum + s.giaBan, 0);

      // Expense (Buying)
      const dayExpenses = recentExpenses.filter(s => new Date(s.createdAt).toISOString().split('T')[0] === dayStr);
      const totalExpense = dayExpenses.reduce((sum, s) => sum + s.tongGiaMua, 0);

      return { date: dayStr, value: totalRevenue, expense: totalExpense };
  });

  const totalRevenue7Days = chartData.reduce((sum, d) => sum + d.value, 0);
  const totalExpense7Days = chartData.reduce((sum, d) => sum + (d.expense || 0), 0);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 font-sans selection:bg-red-100 selection:text-red-900">
      {/* 1. Ultra Clean Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800 px-6 pt-12 pb-6 transition-all duration-300">
          <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto w-full">
              <UserMenu />
              <div className="flex items-center gap-3">
                <div className="md:hidden">
                    <ThemeToggle />
                </div>
                <NotificationBell />
              </div>
          </div>

          {/* Optimized Search Bar */}
          <div className="max-w-7xl mx-auto w-full">
            <DashboardSearch />
          </div>
      </div>

      <div className="px-4 md:px-6 space-y-4 mt-6 max-w-7xl mx-auto w-full">
        
        {/* Bento Grid Layout - Compact & Modern */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Hero Card - Takes 2 columns on desktop */}
            <div className="md:col-span-2">
                <HeroStats 
                    totalRevenue={totalRevenue7Days}
                    totalExpense={totalExpense7Days}
                    chartData={chartData}
                />
            </div>

            {/* Quick Stats - Vertical Stack in 3rd column */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                 <StatCard 
                    href="/cars?group=inventory"
                    icon={Bike}
                    value={carsInStock}
                    label="Tồn Kho"
                    color="violet"
                />
                <StatCard 
                    href="/expenses"
                    icon={Wallet}
                    value={pendingExpenses}
                    label="Cần Duyệt"
                    color="fuchsia"
                />
            </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             <StatCard 
                href="/cars?sort=overdue"
                icon={FileText}
                value={overdueDocs}
                label="Hồ Sơ Lỗi"
                color="indigo"
            />
             {/* Add more stats here if needed, or placeholders */}
             <div className="hidden md:flex md:col-span-3 bg-white/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 items-center justify-center text-slate-400 text-xs font-medium">
                Khu vực mở rộng (Báo cáo nhanh)
             </div>
        </div>

        {/* Recent Activity - Compact List */}
        <RecentImports cars={recentImports} />

      </div>
    </div>
  );
}
