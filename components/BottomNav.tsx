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
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 pb-safe pt-2 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none z-50 md:hidden transition-all duration-300">
      <div className="flex justify-between items-end pb-3">
        {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            if (item.isPrimary) {
                return (
                    <Link 
                        key={item.path} 
                        href={item.path}
                        className="flex flex-col items-center justify-center -mt-10 group"
                    >
                        <div className="bg-linear-to-tr from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white w-14 h-14 rounded-2xl rotate-45 shadow-lg shadow-blue-300 dark:shadow-blue-900/40 flex items-center justify-center group-active:scale-90 transition-all border-[3px] border-white dark:border-gray-900 group-hover:-translate-y-1">
                             <Icon size={26} strokeWidth={3} className="-rotate-45" />
                        </div>
                        {/* <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2 group-active:text-blue-600 dark:group-active:text-blue-400 transition-colors">Nhập</span> */}
                    </Link>
                );
            }

            return (
                <Link 
                    key={item.path} 
                    href={item.path}
                    className={`flex flex-col items-center justify-center w-14 transition-all duration-300 relative group py-1
                        ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                    <div className={`absolute -top-3 w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-b-full transition-all duration-300 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}></div>
                    <Icon size={24} strokeWidth={active ? 2.5 : 2} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-active:scale-95'}`} />
                    <span className={`text-[9px] mt-1 font-medium transition-all duration-300 ${active ? 'opacity-100 font-bold translate-y-0' : 'opacity-70 translate-y-0.5'}`}>
                        {item.label}
                    </span>
                </Link>
            );
        })}
      </div>
    </div>
  );
}
