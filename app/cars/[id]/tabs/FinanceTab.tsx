'use client';

import { 
    Users, Wrench 
} from 'lucide-react';
import Link from 'next/link';
import { FinanceTabProps } from './types';

export default function FinanceTab({ car, totalGop, totalChiPhi }: FinanceTabProps) {
    return (
        <div className="p-4 space-y-4">
             {/* Main Financial Card */}
             <div className="bg-linear-to-br from-gray-900 to-black text-white p-6 rounded-3xl shadow-xl shadow-gray-200 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <div className="relative z-10">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Tổng Giá Mua</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <h2 className="text-3xl font-bold tracking-tight">{car.tongGiaMua.toLocaleString()}</h2>
                        <span className="text-sm font-medium text-gray-500">VNĐ</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                        <div>
                             <p className="text-green-400 text-[10px] uppercase font-bold mb-1">Đã Cọc</p>
                             <p className="font-bold text-lg">{car.soTienCoc.toLocaleString()}</p>
                        </div>
                         <div>
                             {/* Note: soTienDaChuyen might not exist on Car type yet, check prisma schema */}
                             <p className="text-blue-400 text-[10px] uppercase font-bold mb-1">Đã Chuyển</p>
                             <p className="font-bold text-lg">{car.soTienDaChuyen?.toLocaleString() || '0'}</p>
                        </div>
                    </div>
                </div>
             </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Users size={14} /></div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Vốn Góp</p>
                    </div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{totalGop.toLocaleString()}</p>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min((totalGop / (car.tongGiaMua || 1)) * 100, 100)}%` }}></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600"><Wrench size={14} /></div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Chi Phí</p>
                    </div>
                    <p className="font-bold text-lg text-orange-600">{totalChiPhi.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{car.chiPhi.length} khoản mục</p>
                </div>
            </div>

            {/* Investors List */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Danh sách góp vốn</span>
                    <Link href={`/cars/${car.id}/investors/new`} className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded-lg transition-colors">
                        + Thêm
                    </Link>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {car.gopVon.map((inv) => (
                        <div key={inv.id} className="p-4 flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs mr-3">
                                    {inv.nguoiGop.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{inv.nguoiGop}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{inv.tyLeGop}% cổ phần</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                {inv.soTienGop.toLocaleString()}
                            </span>
                        </div>
                    ))}
                    {car.gopVon.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-xs italic">Chưa có nhà đầu tư nào.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
