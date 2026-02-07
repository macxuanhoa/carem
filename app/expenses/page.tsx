import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, DollarSign, Filter, Search, MoreHorizontal, Wallet } from 'lucide-react';
import { Suspense } from 'react';
import { formatCurrency, formatShortDate, formatStatus } from '@/lib/utils';
import ExpenseHeader from './ExpenseHeader';

async function ExpenseList({ currentTab, query }: { currentTab: string, query?: string }) {
    const whereClause: any = currentTab === 'PENDING' 
    ? { trangThai: 'CHO_DUYET' } 
    : { trangThai: { in: ['DA_DUYET', 'TU_CHOI'] } };

    if (query) {
        whereClause.OR = [
            { loaiChiPhi: { contains: query } },
            { ghiChu: { contains: query } },
            { xeMuaVao: { dongXe: { contains: query } } },
            { xeMuaVao: { bienSo: { contains: query } } }
        ];
    }

    let expenses = [];
    try {
        expenses = await prisma.chiPhiXe.findMany({
            where: whereClause,
            include: { xeMuaVao: true },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    } catch (error) {
        return <div className="p-10 text-center text-red-500 text-sm">Lỗi tải dữ liệu. Vui lòng thử lại.</div>;
    }

    if (expenses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-full mb-4 shadow-inner">
                    <Wallet size={40} className="text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium">Không có khoản chi nào.</p>
                {currentTab === 'PENDING' && <p className="text-xs mt-1">Tuyệt vời! Bạn đã xử lý hết các yêu cầu.</p>}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {expenses.map((exp) => (
                <div key={exp.id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.99] transition-transform">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                exp.trangThai === 'CHO_DUYET' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                                exp.trangThai === 'DA_DUYET' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            }`}>
                                <DollarSign size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{exp.loaiChiPhi}</h3>
                                {exp.xeMuaVao ? (
                                    <Link href={`/cars/${exp.xeMuaVao.id}`} className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center mt-0.5">
                                        {exp.xeMuaVao.dongXe} 
                                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded ml-1 text-[10px] font-mono border border-gray-200 dark:border-gray-700">
                                            {exp.xeMuaVao.bienSo || 'N/A'}
                                        </span>
                                    </Link>
                                ) : (
                                    <p className="text-xs text-gray-400 italic mt-0.5">Chi phí hoạt động chung</p>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`block font-bold text-base ${
                                exp.trangThai === 'TU_CHOI' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'
                            }`}>
                                {formatCurrency(exp.giaDuKien)}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">{formatShortDate(exp.createdAt)}</span>
                        </div>
                    </div>

                    {exp.ghiChu && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl text-xs text-gray-600 dark:text-gray-300 mb-3 mt-2 border border-gray-100 dark:border-gray-700">
                            "{exp.ghiChu}"
                        </div>
                    )}

                    {/* Action Footer only for Pending */}
                    {exp.trangThai === 'CHO_DUYET' && (
                        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-dashed border-gray-100 dark:border-gray-800">
                            <button className="flex items-center justify-center text-red-500 dark:text-red-400 text-xs font-bold py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                <XCircle size={16} className="mr-1.5"/> Từ chối
                            </button>
                            <Link 
                                href={`/expenses/${exp.id}/approve`}
                                className="flex items-center justify-center bg-purple-600 dark:bg-purple-600 text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-purple-200 dark:shadow-none hover:bg-purple-700 transition-colors"
                            >
                                <CheckCircle size={16} className="mr-1.5"/> Duyệt Chi
                            </Link>
                        </div>
                    )}
                    
                    {/* Status Badge for History */}
                    {exp.trangThai !== 'CHO_DUYET' && (
                        <div className="flex justify-end mt-2">
                            <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${
                                exp.trangThai === 'DA_DUYET' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            }`}>
                                {formatStatus(exp.trangThai)} {exp.nguoiDuyet ? `• ${exp.nguoiDuyet}` : ''}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function ExpensesSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse mr-3"></div>
                            <div>
                                <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
                                <div className="h-3 w-20 bg-gray-50 dark:bg-gray-800 rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="h-5 w-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-1"></div>
                            <div className="h-3 w-12 bg-gray-50 dark:bg-gray-800 rounded animate-pulse ml-auto"></div>
                        </div>
                    </div>
                    <div className="h-10 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse mt-2"></div>
                </div>
            ))}
        </div>
    );
}

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<{ tab?: string, q?: string }> }) {
  const { tab, q } = await searchParams;
  const currentTab = tab || 'PENDING';
  const currentQuery = q || '';

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-24 font-sans">
      {/* 1. Header */}
      <div className="bg-white dark:bg-gray-900 pt-6 px-4 pb-0 sticky top-0 z-30 shadow-sm border-b border-gray-100 dark:border-gray-800">
         <ExpenseHeader />

         {/* Modern Segmented Tabs */}
         <div className="flex bg-gray-100/80 dark:bg-gray-800 p-1.5 rounded-2xl mx-auto max-w-md mt-2">
             <Link 
                href="/expenses?tab=PENDING" 
                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                    currentTab === 'PENDING' 
                    ? 'bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                }`}
             >
                 Cần Duyệt
             </Link>
             <Link 
                href="/expenses?tab=HISTORY" 
                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                    currentTab === 'HISTORY' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                }`}
             >
                 Lịch Sử
             </Link>
         </div>
      </div>

      <div className="p-4">
        <Suspense fallback={<ExpensesSkeleton />}>
            <ExpenseList currentTab={currentTab} query={currentQuery} />
        </Suspense>
      </div>
    </div>
  );
}
