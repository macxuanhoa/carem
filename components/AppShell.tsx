'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from "@/components/ThemeToggle";
import BottomNav from "@/components/BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="mx-auto max-w-7xl min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        {!isLoginPage && (
            <header className="hidden md:flex bg-white dark:bg-gray-900 dark:border-b dark:border-gray-800 shadow-sm px-6 py-4 justify-between items-center sticky top-0 z-50 transition-colors duration-200">
                <div className="flex flex-col">
                    <div className="font-black text-xl text-blue-600 dark:text-blue-500 uppercase tracking-tight leading-none">
                        XE MÁY CÀ REM
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-1 flex items-center gap-1">
                        <span>107 Nguyễn Tất Thành, Hội An</span>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <nav className="space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <Link href="/" className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === '/' ? 'text-blue-600 dark:text-blue-400' : ''}`}>Dashboard</Link>
                        <Link href="/cars" className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname?.startsWith('/cars') ? 'text-blue-600 dark:text-blue-400' : ''}`}>Xe</Link>
                        <Link href="/expenses" className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname?.startsWith('/expenses') ? 'text-blue-600 dark:text-blue-400' : ''}`}>Chi Phí</Link>
                        <Link href="/reports" className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname?.startsWith('/reports') ? 'text-blue-600 dark:text-blue-400' : ''}`}>Báo Cáo</Link>
                    </nav>
                    <div className="pl-6 border-l border-gray-200 dark:border-gray-700">
                        <ThemeToggle />
                    </div>
                </div>
            </header>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full">
            {children}
        </main>

        {/* Mobile Bottom Nav - Hide on login */}
        {!isLoginPage && <BottomNav />}
    </div>
  );
}