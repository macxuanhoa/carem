'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import dynamic from 'next/dynamic';

const DashboardChart = dynamic<any>(() => import('../DashboardChart').then(mod => mod.default), { 
    ssr: false,
    loading: () => <div className="h-16 w-full bg-white/10 rounded-xl animate-pulse" />
});

interface HeroStatsProps {
  totalRevenue: number;
  totalExpense: number;
  chartData: any[];
}

export default function HeroStats({ totalRevenue, totalExpense, chartData }: HeroStatsProps) {
  return (
    <Link href="/reports" className="block relative overflow-hidden rounded-3xl p-6 group transition-all duration-500 shadow-xl hover:shadow-violet-500/20 active:scale-[0.99] border border-white/5 bg-slate-900/50 backdrop-blur-md">
        {/* Galaxy Gradient Background - Darker & Richer */}
        <div className="absolute inset-0 bg-linear-to-br from-violet-900/80 via-purple-900/80 to-indigo-950/90 transition-all duration-500"></div>
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        {/* Abstract Cosmic Shapes - Adjusted for Dark Theme */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/10 rounded-full blur-[60px] -ml-10 -mb-10 group-hover:scale-125 transition-transform duration-700"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Stats */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                    <p className="text-violet-200 text-[10px] font-bold uppercase tracking-widest">Tổng quan tài chính</p>
                </div>
                
                <div className="flex items-center gap-8">
                    <div>
                        <p className="text-[10px] text-slate-400 font-medium mb-0.5">Doanh Thu Tuần</p>
                        <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-lg leading-none">
                            {formatCurrency(totalRevenue).replace(' đ', '')}
                            <span className="text-xl text-violet-400/80 font-medium ml-0.5">đ</span>
                        </h2>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-medium mb-0.5">Chi Nhập Xe</p>
                        <h2 className="text-xl font-bold tracking-tight text-white/90 leading-none">
                            {formatCurrency(totalExpense).replace(' đ', '')}
                            <span className="text-sm text-violet-400/60 font-medium ml-0.5">đ</span>
                        </h2>
                    </div>
                </div>
            </div>
            
            {/* Right: Chart (Compact) */}
            <div className="h-16 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                <DashboardChart data={chartData} type="area" />
            </div>
        </div>
    </Link>
  );
}
