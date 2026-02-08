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
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe pt-1 z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-5 h-[60px]">
        {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            if (item.isPrimary) {
                return (
                    <div key={item.path} className="relative -top-6 flex justify-center">
                        <Link 
                            href={item.path}
                            className="flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg shadow-blue-500/40 border-4 border-gray-50 dark:border-gray-950 transition-transform active:scale-95"
                        >
                             <Icon size={28} strokeWidth={3} />
                        </Link>
                    </div>
                );
            }

            return (
                <Link 
                    key={item.path} 
                    href={item.path}
                    className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                        active 
                        ? 'text-blue-600 dark:text-blue-400 font-bold' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium'
                    }`}
                >
                    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                    <span className="text-[10px]">{item.label}</span>
                </Link>
            );
        })}
      </div>
    </div>
  );
}
