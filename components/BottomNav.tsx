'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Car, DollarSign, BarChart2, Plus } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
      if (path === '/') return pathname === '/';
      if (path === '/cars') return pathname.startsWith('/cars') && pathname !== '/cars/new';
      return pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Xe', path: '/cars', icon: Car },
    // Center Action Button
    { label: 'Nhập', path: '/cars/new', icon: Plus, isPrimary: true }, 
    { label: 'Chi phí', path: '/expenses', icon: DollarSign },
    { label: 'Báo cáo', path: '/reports', icon: BarChart2 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none z-50 md:hidden transition-colors duration-200">
      <div className="flex justify-between items-end pb-2">
        {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            if (item.isPrimary) {
                return (
                    <Link 
                        key={item.path} 
                        href={item.path}
                        className="flex flex-col items-center justify-center -mt-8 group"
                    >
                        <div className="bg-blue-600 dark:bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg shadow-blue-200 dark:shadow-blue-900/40 flex items-center justify-center group-active:scale-90 transition-all border-4 border-white dark:border-gray-900">
                             <Icon size={28} strokeWidth={3} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 group-active:text-blue-600 dark:group-active:text-blue-400 transition-colors">Nhập</span>
                    </Link>
                );
            }

            return (
                <Link 
                    key={item.path} 
                    href={item.path}
                    className={`flex flex-col items-center justify-center w-12 transition-all duration-200 active:scale-95
                        ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                    <Icon size={24} strokeWidth={active ? 2.5 : 2} className={active ? 'fill-blue-100 dark:fill-blue-900/30' : ''} />
                    <span className={`text-[10px] mt-1 font-medium ${active ? 'opacity-100 font-bold' : 'opacity-80'}`}>
                        {item.label}
                    </span>
                </Link>
            );
        })}
      </div>
    </div>
  );
}
