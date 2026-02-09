import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import DashboardChart from '../DashboardChart';

interface HeroStatsProps {
  totalRevenue: number;
  totalExpense: number;
  chartData: any[];
}

export default function HeroStats({ totalRevenue, totalExpense, chartData }: HeroStatsProps) {
  return (
    <Link href="/reports" className="block relative overflow-hidden rounded-4xl p-8 group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-[0.99]">
        {/* Background with Modern Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-blue-900 dark:via-indigo-900 dark:to-slate-900 transition-all duration-500"></div>
        
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
                            {formatCurrency(totalRevenue).replace('₫', '')}
                            <span className="text-2xl sm:text-3xl text-blue-200/80 font-medium ml-1">₫</span>
                        </h2>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-white/20"></div>
                    <div>
                        <p className="text-xs text-blue-200 font-medium mb-1">Chi Nhập Xe</p>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white/90">
                            {formatCurrency(totalExpense).replace('₫', '')}
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
  );
}
