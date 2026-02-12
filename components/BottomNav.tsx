'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bike, DollarSign, BarChart2, Plus } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide BottomNav on login page
  if (pathname === '/login') return null;

  const isActive = (path: string) => {
    // Default hover state for home
    if (path === '/') return pathname === '/' || pathname === '/dashboard';
    if (path === '/cars') return pathname.startsWith('/cars') && pathname !== '/cars/new';
    return pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: Home },
    { label: 'Kho Xe', path: '/cars', icon: Bike },
    // Center Action Button
    { label: 'Nhập Xe', path: '/cars/new', icon: Plus, isPrimary: true }, 
    { label: 'Chi phí', path: '/expenses', icon: DollarSign },
    { label: 'Báo cáo', path: '/reports', icon: BarChart2 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800 pb-safe pt-2 z-50 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div className="grid grid-cols-5 h-[60px] items-center">
        {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            if (item.isPrimary) {
                return (
                    <div key={item.path} className="relative -top-8 flex justify-center">
                        <Link 
                            href={item.path}
                            prefetch={true}
                            className="flex flex-col items-center justify-center bg-galaxy-gradient text-white w-14 h-14 rounded-[1.2rem] shadow-xl shadow-purple-500/30 border-4 border-slate-50 dark:border-slate-950 transition-all active:scale-95 group touch-manipulation"
                        >
                             <Icon size={26} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                        </Link>
                    </div>
                );
            }

            return (
                <Link 
                    key={item.path} 
                    href={item.path}
                    prefetch={true}
                    className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 touch-manipulation ${
                        active 
                        ? 'text-violet-600 dark:text-violet-400' 
                        : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                    <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-violet-50 dark:bg-violet-900/20 translate-y-[-2px]' : ''}`}>
                        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                    </div>
                    <span className={`text-[10px] font-medium transition-all duration-300 ${active ? 'font-bold opacity-100' : 'opacity-80'}`}>
                        {item.label}
                    </span>
                </Link>
            );
        })}
      </div>
    </div>
  );
}
