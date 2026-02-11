'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';
import { logout } from '@/app/actions';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative z-50">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 group cursor-pointer p-1.5 -ml-1.5 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all active:scale-95 text-left outline-none"
            >
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-white dark:ring-slate-700 relative">
                    <Image 
                        src="/avtcarem.jpg" 
                        alt="Cà Rem" 
                        fill
                        className="object-cover"
                        sizes="40px"
                    />
                </div>
                <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Xin chào,</p>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Cà Rem</h1>
                </div>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                        <div className="p-1">
                            <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Tài khoản
                            </div>
                            <button 
                                disabled
                                className="w-full flex items-center px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors opacity-50 cursor-not-allowed"
                            >
                                <User size={16} className="mr-2" />
                                Hồ sơ (Sớm ra mắt)
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                            <button 
                                onClick={() => logout()}
                                className="w-full flex items-center px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                            >
                                <LogOut size={16} className="mr-2" />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
