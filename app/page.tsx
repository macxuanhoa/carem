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
    <div className="bg-background min-h-screen pb-24 font-sans selection:bg-blue-500/30 selection:text-blue-200 bg-spotlight relative overflow-x-hidden">
      {/* Ambient Light Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      {/* 1. Glass Sticky Header */}
      <div className="sticky top-0 z-30 glass-panel border-b-0 px-6 pt-12 pb-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-6 relative z-10">
              <UserMenu />
              <div className="flex items-center gap-3">
                <div className="md:hidden">
                    <ThemeToggle />
                </div>
                <NotificationBell />
              </div>
          </div>

          {/* Optimized Search Bar */}
          <div className="relative z-10">
             <DashboardSearch />
          </div>
      </div>

      <div className="px-6 space-y-8 mt-8 relative z-10">
        
        {/* 2. Hero Card: Aero Design */}
        <Link href="/reports" className="block relative overflow-hidden rounded-[32px] group transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-black dark:bg-gray-900"></div>
            
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-indigo-900 to-black"></div>
            
            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] border border-white/10 rounded-[32px]"></div>

            <div className="relative p-6 sm:p-8">
                <div className="flex justify-between items-end">
                    <div className="mb-2">
                        <p className="text-blue-200/80 text-[11px] font-bold uppercase tracking-[0.2em] mb-3 flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-pulse"></span>
                            Tài chính tuần
                        </p>
                        <div className="flex items-end gap-6">
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold mb-1 tracking-wide">Doanh Thu</p>
                                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-xl">
                                    {formatCurrency(totalRevenue7Days).replace('₫', '')}
                                    <span className="text-lg text-gray-500 ml-1 font-medium">₫</span>
                                </h2>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold mb-1 tracking-wide">Chi Nhập Xe</p>
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-red-400 drop-shadow-lg">
                                    {formatCurrency(chartData.reduce((sum, d) => sum + (d.expense || 0), 0)).replace('₫', '')}
                                </h2>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-28 w-48 -mb-4 opacity-80 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0">
                        <DashboardChart data={chartData} type="bar" />
                    </div>
                </div>
            </div>
        </Link>

        {/* 3. Stat Widgets - Instrument Cluster */}
        <div className="grid grid-cols-3 gap-4">
            <Link href="/cars?group=inventory" className="card-instrument p-5 flex flex-col justify-between h-40 group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Bike size={64} className="text-blue-500 rotate-12" />
                </div>
                <div className="bg-blue-500/10 dark:bg-blue-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 z-10 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                    <Bike size={24} strokeWidth={2} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="z-10">
                    <p className="text-4xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">{carsInStock}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Tồn Kho</p>
                </div>
            </Link>

            <Link href="/expenses" className="card-instrument p-5 flex flex-col justify-between h-40 group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wallet size={64} className="text-purple-500 rotate-12" />
                </div>
                <div className="bg-purple-500/10 dark:bg-purple-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 z-10 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                    <Wallet size={24} strokeWidth={2} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="z-10">
                    <p className="text-4xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">{pendingExpenses}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Cần Duyệt</p>
                </div>
            </Link>

            <Link href="/cars?sort=overdue" className="card-instrument p-5 flex flex-col justify-between h-40 group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileText size={64} className="text-red-500 rotate-12" />
                </div>
                 <div className="bg-red-500/10 dark:bg-red-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 z-10 group-hover:scale-110 transition-transform duration-300 border border-red-500/20">
                    <FileText size={24} strokeWidth={2} className="text-red-600 dark:text-red-400" />
                </div>
                <div className="z-10">
                    <p className="text-4xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">{overdueDocs}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Hồ Sơ Lỗi</p>
                </div>
            </Link>
        </div>

        {/* Recent Activity - Aero List */}
        <section className="pt-4">
            <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                    Xe Mới Nhập
                </h3>
                <Link href="/cars" className="text-[10px] text-gray-500 dark:text-gray-400 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider flex items-center gap-1 group">
                    Xem tất cả 
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
                    <Link key={car.id} href={`/cars/${car.id}`} className="card-instrument p-4 flex justify-between items-center group glow-effect">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden relative shadow-inner">
                                {image ? (
                                    <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={car.dongXe} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                                        {car.dongXe.substring(0, 1).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-500 transition-colors">{car.dongXe}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border border-gray-200 dark:border-white/10">
                                        {car.bienSo || 'N/A'}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium tracking-wide">{formatTimeAgo(car.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-base text-blue-600 dark:text-blue-400">{formatCurrency(car.tongGiaMua || 0)}</p>
                            <div className="mt-1.5">
                                <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                    car.trangThai === 'DA_BAN' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' :
                                    car.trangThai === 'DANG_BAN' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                                    'bg-gray-500/10 text-gray-500 dark:text-gray-400 border border-gray-500/20'
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
