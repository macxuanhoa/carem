import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Car, FileText, DollarSign, Wallet, TrendingUp, Bell, ArrowRight
} from 'lucide-react';
import DashboardChart from './components/DashboardChart';
import DashboardSearch from '@/components/DashboardSearch';
import ThemeToggle from '@/components/ThemeToggle';
import UserMenu from '@/components/UserMenu';
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
    { revalidate: 60 } // Cache for 60 seconds
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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-24 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Ultra Clean Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 pt-12 pb-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
              <UserMenu />
              <div className="flex items-center gap-2">
                <div className="md:hidden">
                    <ThemeToggle />
                </div>
                <Link href="/cars?sort=overdue" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all relative active:scale-95 shadow-sm">
                    <Bell size={20} strokeWidth={2} />
                    {(overdueDocs > 0 || pendingExpenses > 0) && (
                        <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                    )}
                </Link>
              </div>
          </div>

          {/* Optimized Search Bar */}
          <DashboardSearch />
      </div>

      <div className="px-4 space-y-8 mt-6">
        
        {/* 2. Hero Card: High Performance Black Theme */}
        <Link href="/reports" className="block bg-gray-900 dark:bg-black text-white p-5 rounded-3xl shadow-xl shadow-gray-200 dark:shadow-none relative overflow-hidden group active:scale-[0.98] transition-all duration-200">
            {/* Subtle Gradient - No blur for performance */}
            <div className="absolute top-0 right-0 w-full h-full bg-linear-to-bl from-gray-800/50 to-transparent opacity-50"></div>
            
            <div className="relative z-10 flex justify-between items-end">
                <div className="mb-2">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Tài chính tuần
                    </p>
                    <div className="flex items-end gap-4">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold mb-0.5">Doanh Thu</p>
                            <h2 className="text-2xl font-bold tracking-tight text-white">
                                {formatCurrency(totalRevenue7Days).replace('₫', '')}
                            </h2>
                        </div>
                        <div className="w-px h-8 bg-gray-800"></div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold mb-0.5">Chi Nhập Xe</p>
                            <h2 className="text-xl font-bold tracking-tight text-red-400">
                                {formatCurrency(chartData.reduce((sum, d) => sum + (d.expense || 0), 0)).replace('₫', '')}
                            </h2>
                        </div>
                    </div>
                </div>
                
                <div className="h-24 w-40 -mb-2 opacity-90 group-hover:opacity-100 transition-opacity">
                    <DashboardChart data={chartData} type="bar" />
                </div>
            </div>
        </Link>

        {/* 3. Stat Widgets - Clean Style */}
        <div className="grid grid-cols-3 gap-3">
            <Link href="/cars?group=inventory" className="card-premium p-4 flex flex-col justify-between h-32 group hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Car size={20} strokeWidth={2.5} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{carsInStock}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Xe Tồn Kho</p>
                </div>
            </Link>

            <Link href="/expenses" className="card-premium p-4 flex flex-col justify-between h-32 group hover:border-purple-200 dark:hover:border-purple-900 transition-colors">
                <div className="bg-purple-50 dark:bg-purple-900/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Wallet size={20} strokeWidth={2.5} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{pendingExpenses}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Cần Duyệt</p>
                </div>
            </Link>

            <Link href="/cars?sort=overdue" className="card-premium p-4 flex flex-col justify-between h-32 group hover:border-red-200 dark:hover:border-red-900 transition-colors">
                 <div className="bg-red-50 dark:bg-red-900/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <FileText size={20} strokeWidth={2.5} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{overdueDocs}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Hồ Sơ Lỗi</p>
                </div>
            </Link>
        </div>

        {/* Recent Activity - Optimized List */}
        <section className="pt-2">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Xe Mới Nhập</h3>
                <Link href="/cars" className="text-xs text-gray-600 dark:text-gray-400 font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 rounded-xl shadow-sm transition-all active:scale-95">
                    Xem tất cả
                </Link>
            </div>
            <div className="space-y-3">
                {recentImports.map(car => {
                    let image = null;
                    try {
                        const images = JSON.parse(car.hinhAnh || '[]');
                        if (images.length > 0) image = images[0];
                    } catch (e) {}

                    return (
                    <Link key={car.id} href={`/cars/${car.id}`} className="card-premium p-4 flex justify-between items-center group">
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4 font-bold text-sm border border-gray-100 dark:border-gray-700 group-hover:border-blue-100 dark:group-hover:border-blue-900 overflow-hidden relative">
                                {image ? (
                                    <img src={image} className="w-full h-full object-cover" alt={car.dongXe} />
                                ) : (
                                    <div className="bg-gray-50 dark:bg-gray-800 w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                        {car.dongXe.substring(0, 1).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-0.5 line-clamp-1">{car.dongXe}</h4>
                                <div className="flex items-center space-x-2">
                                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                                        {car.bienSo || 'N/A'}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">{formatTimeAgo(car.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-sm text-blue-600 dark:text-blue-400">{formatCurrency(car.tongGiaMua || 0)}</p>
                            <div className="mt-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    car.trangThai === 'DA_BAN' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                    car.trangThai === 'DANG_BAN' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                    'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                }`}>
                                    {formatStatus(car.trangThai)}
                                </span>
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
