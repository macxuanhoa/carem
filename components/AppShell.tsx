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
            <header className="hidden md:flex bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800 px-8 py-4 justify-between items-center sticky top-0 z-50 transition-all duration-300">
                <div className="flex flex-col">
                    <div className="font-black text-2xl text-blue-600 dark:text-blue-500 uppercase tracking-tighter leading-none flex items-center gap-2">
                        <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-lg">C</span>
                        XE MÁY CÀ REM
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest mt-1.5 pl-10">
                        107 Nguyễn Tất Thành, Hội An
                    </div>
                </div>
                <div className="flex items-center gap-10">
                    <nav className="flex gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl">
                        {[
                            { href: '/', label: 'Dashboard' },
                            { href: '/cars', label: 'Kho Xe' },
                            { href: '/expenses', label: 'Chi Phí' },
                            { href: '/reports', label: 'Báo Cáo' },
                        ].map((link) => (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                    (link.href === '/' && pathname === '/') || (link.href !== '/' && pathname?.startsWith(link.href))
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="pl-6 border-l border-slate-200 dark:border-slate-700">
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