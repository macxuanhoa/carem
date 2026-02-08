import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Bike, FileText, DollarSign, Wallet, TrendingUp, ArrowRight
} from 'lucide-react';
import DashboardChart from './components/DashboardChart';
import DashboardSearch from '@/components/DashboardSearch';
import ThemeToggle from '@/components/ThemeToggle';
import UserMenu from '@/components/UserMenu';
import NotificationBell from '@/components/NotificationBell';
import { formatCurrency, formatTimeAgo, formatStatus } from '@/lib/utils';
import { unstable_cache } from 'next/cache';

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
    { revalidate: 1, tags: ['dashboard'] } // Reduce revalidate to 1s and add tag for on-demand revalidation
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

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 font-sans selection:bg-blue-100 selection:text-blue-900">
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

      <div className="px-4 md:px-8 space-y-8 mt-8 max-w-7xl mx-auto w-full">
        
        {/* 2. Hero Card: Modern Glassmorphism Gradient */}
        <Link href="/reports" className="block relative overflow-hidden rounded-[2.5rem] p-8 group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-[0.99]">
            {/* Background with Modern Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-blue-900 dark:via-indigo-900 dark:to-slate-900 transition-all duration-500"></div>
            
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10 group-hover:scale-125 transition-transform duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Tổng quan tài chính</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-end gap-8 mt-4">
                        <div>
                            <p className="text-xs text-blue-200 font-medium mb-1">Doanh Thu Tuần</p>
                            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                                {formatCurrency(totalRevenue7Days).replace('₫', '')}
                                <span className="text-2xl sm:text-3xl text-blue-200/80 font-medium ml-1">₫</span>
                            </h2>
                        </div>
                        <div className="hidden sm:block w-px h-12 bg-white/20"></div>
                        <div>
                            <p className="text-xs text-blue-200 font-medium mb-1">Chi Nhập Xe</p>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white/90">
                                {formatCurrency(chartData.reduce((sum, d) => sum + (d.expense || 0), 0)).replace('₫', '')}
                                <span className="text-lg text-blue-200/60 font-medium ml-1">₫</span>
                            </h2>
                        </div>
                    </div>
                </div>
                
                <div className="h-24 w-full md:w-48 opacity-90 group-hover:opacity-100 transition-opacity translate-y-2">
                    <DashboardChart data={chartData} type="bar" />
                </div>
            </div>
        </Link>

        {/* 3. Stat Widgets - Clean & Airy */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <Link href="/cars?group=inventory" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-4px_rgba(37,99,235,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center justify-center gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                    <Bike size={28} strokeWidth={2} />
                </div>
                <div className="z-10">
                    <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{carsInStock}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Tồn Kho</p>
                </div>
            </Link>

            <Link href="/expenses" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-4px_rgba(168,85,247,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center justify-center gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-50/50 dark:bg-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                    <Wallet size={28} strokeWidth={2} />
                </div>
                <div className="z-10">
                    <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{pendingExpenses}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Cần Duyệt</p>
                </div>
            </Link>

            <Link href="/cars?sort=overdue" className="group bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-4px_rgba(239,68,68,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center justify-center gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-50/50 dark:bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                    <FileText size={28} strokeWidth={2} />
                </div>
                <div className="z-10">
                    <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{overdueDocs}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">Hồ Sơ Lỗi</p>
                </div>
            </Link>
        </div>

        {/* Recent Activity - Minimal List */}
        <section>
            <div className="flex justify-between items-end mb-6 px-2">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Xe Mới Nhập</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">Cập nhật theo thời gian thực</p>
                </div>
                <Link href="/cars" className="group flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl transition-all hover:bg-blue-100 dark:hover:bg-blue-900/40 active:scale-95">
                    Xem tất cả <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="space-y-4">
                {recentImports.map(car => {
                    let image = null;
                    try {
                        const images = JSON.parse(car.hinhAnh || '[]');
                        if (images.length > 0) image = images[0];
                    } catch (e) {}

                    return (
                    <Link key={car.id} href={`/cars/${car.id}`} className="block bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 group hover:-translate-y-0.5">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 overflow-hidden relative shadow-inner">
                                    {image ? (
                                        <img src={image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={car.dongXe} />
                                    ) : (
                                        <Bike size={24} strokeWidth={1.5} />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-base text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{car.dongXe}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider border border-slate-200 dark:border-slate-700">
                                            {car.bienSo || 'CHƯA CÓ BIỂN'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium flex items-center">
                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mr-2"></span>
                                            {formatTimeAgo(car.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <p className="font-black text-base text-blue-600 dark:text-blue-400 tracking-tight">{formatCurrency(car.tongGiaMua || 0)}</p>
                                <div className="mt-1.5 flex justify-end">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                        car.trangThai === 'DA_BAN' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' :
                                        car.trangThai === 'DANG_BAN' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' :
                                        'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                    }`}>
                                        {formatStatus(car.trangThai)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                )})}
            </div>
        </section>

      </div>
    </div>
  );
}
