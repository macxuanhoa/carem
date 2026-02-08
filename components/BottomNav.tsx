'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bike, DollarSign, BarChart2, Plus } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide BottomNav on login page
  if (pathname === '/login') return null;

  const isActive = (path: string) => {
      if (path === '/') return pathname === '/';
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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none">
      {/* Floating Glass Bar */}
      <div className="mx-4 mb-5 pb-safe pointer-events-auto">
        <div className="glass-panel rounded-[24px] h-[72px] grid grid-cols-5 items-center relative overflow-hidden">
            
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent pointer-events-none"></div>

            {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                
                if (item.isPrimary) {
                    return (
                        <div key={item.path} className="relative flex justify-center -top-6">
                            <Link 
                                href={item.path}
                                className="group flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 shadow-[0_8px_32px_rgba(37,99,235,0.4)] border-4 border-gray-100 dark:border-gray-900 relative z-10 transition-transform active:scale-95"
                            >
                                <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                                <Icon size={28} strokeWidth={2.5} className="text-white relative z-10" />
                            </Link>
                        </div>
                    );
                }

                return (
                    <Link 
                        key={item.path} 
                        href={item.path}
                        className={`relative flex flex-col items-center justify-center h-full space-y-1 transition-all duration-300 group ${
                            active 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                    >
                        {/* Active Light Ray Indicator */}
                        {active && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-b-full shadow-[0_2px_12px_rgba(59,130,246,0.5)]"></div>
                        )}
                        
                        <div className={`transition-transform duration-300 ${active ? '-translate-y-1' : 'group-hover:-translate-y-0.5'}`}>
                            <Icon size={24} strokeWidth={active ? 2.5 : 1.5} />
                        </div>
                        <span className={`text-[9px] font-bold tracking-wide transition-all duration-300 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 absolute'}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </div>
      </div>
    </div>
  );
}
