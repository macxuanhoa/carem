'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Activity, Calendar, Clock, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatTimeAgo } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Notification {
  id: number;
  hanhDong: string;
  chiTiet: string;
  nguoiThucHien: string;
  createdAt: string;
  xeMuaVao?: {
    bienSo: string | null;
    dongXe: string;
    mauXe: string;
  };
}

interface NotificationResponse {
    data: Notification[];
    metadata: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  
  // Reset page when searching
  useEffect(() => {
      setPage(1);
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery<NotificationResponse>({
    queryKey: ['all-activities', page], // Include page in key
    queryFn: async () => {
      const res = await fetch(`/api/notifications?limit=20&page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    placeholderData: (previousData) => previousData // Keep previous data while fetching new
  });

  const notifications = data?.data || [];
  const metadata = data?.metadata;

  // ... (pagination logic)

  const groupedNotifications = notifications.reduce((groups, notif) => {
    try {
        const date = new Date(notif.createdAt).toLocaleDateString('vi-VN', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
        if (!groups[date]) {
        groups[date] = [];
        }
        groups[date].push(notif);
    } catch (e) {
        console.error("Invalid date", notif.createdAt);
    }
    return groups;
  }, {} as Record<string, Notification[]>);

  const getColor = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('thêm') || lower.includes('create') || lower.includes('nhập')) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20';
    if (lower.includes('sửa') || lower.includes('update')) return 'bg-blue-500/20 text-blue-400 border border-blue-500/20';
    if (lower.includes('xóa') || lower.includes('delete')) return 'bg-rose-500/20 text-rose-400 border border-rose-500/20';
    if (lower.includes('bán') || lower.includes('sell')) return 'bg-violet-500/20 text-violet-400 border border-violet-500/20';
    if (lower.includes('hồ sơ') || lower.includes('docs')) return 'bg-amber-500/20 text-amber-400 border border-amber-500/20';
    return 'bg-slate-700/50 text-slate-400 border border-slate-700/50';
  };

  const getActionLabel = (action: string) => {
      // Map generic codes to user friendly labels
      const lower = action.toLowerCase();
      if (lower.includes('create') || lower.includes('thêm')) return 'Thêm mới';
      if (lower.includes('update') || lower.includes('sửa') || lower.includes('cập nhật')) return 'Cập nhật';
      if (lower.includes('delete') || lower.includes('xóa')) return 'Đã xóa';
      if (lower.includes('sell') || lower.includes('bán')) return 'Bán xe';
      if (lower.includes('docs') || lower.includes('hồ sơ')) return 'Hồ sơ';
      if (lower.includes('expense') || lower.includes('chi phí')) return 'Chi phí';
      return action;
  };

  return (
    <div className="bg-slate-950 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-slate-900 sticky top-0 z-30 px-4 py-3 shadow-sm border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center">
            <Link href="/" className="p-2 -ml-2 text-slate-400 hover:bg-slate-800 rounded-full transition-colors">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-lg text-white ml-2 flex items-center">
                <Activity size={20} className="mr-2 text-violet-500" />
                Hoạt Động Hệ Thống
            </h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        
        {/* Search */}
        <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
                type="text" 
                placeholder="Tìm kiếm hoạt động..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 outline-none text-white placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm"
            />
        </div>

        {/* Content */}
        {isLoading ? (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        ) : isError ? (
            <div className="text-center py-12 text-slate-400">
                <Activity size={48} className="mx-auto mb-4 text-rose-500/50" />
                <p className="text-rose-400 font-bold">Không thể tải dữ liệu</p>
                <p className="text-xs mt-1 text-slate-500">Vui lòng thử lại sau</p>
            </div>
        ) : !notifications || notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
                <Activity size={48} className="mx-auto mb-4 opacity-20" />
                <p>Không tìm thấy hoạt động nào</p>
            </div>
        ) : (
            <div className="space-y-8">
                {Object.entries(groupedNotifications || {}).map(([date, items]) => (
                    <div key={date} className="relative">
                        <div className="sticky top-16 z-10 flex justify-center mb-4">
                            <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-slate-700 uppercase tracking-wide">
                                {date}
                            </span>
                        </div>
                        
                        <div className="relative border-l-2 border-slate-800 ml-4 md:ml-6 space-y-6 pb-4">
                            {items.map((item) => (
                                <div key={item.id} className="relative pl-6 md:pl-8 group">
                                    {/* Dot */}
                                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-slate-950 ${getColor(item.hanhDong)} shadow-sm z-10`}></div>
                                    
                                    <div className="bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-800 group-hover:border-violet-500/30 transition-all cursor-pointer hover:bg-slate-800/50" onClick={() => {
                                        if (item.xeMuaVao?.bienSo || item.xeMuaVao?.dongXe) {
                                            // Redirect logic or expand detail modal could be here
                                        }
                                    }}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getColor(item.hanhDong)}`}>
                                                {getActionLabel(item.hanhDong)}
                                            </span>
                                            <span className="text-[10px] text-slate-500 flex items-center">
                                                <Clock size={10} className="mr-1" />
                                                {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-slate-200 font-medium mb-2 group-hover:text-white transition-colors">
                                            {item.chiTiet}
                                        </p>

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-800 mt-2">
                                            <div className="flex items-center text-xs text-slate-500">
                                                <span className="font-bold mr-1 text-slate-400">Người thực hiện:</span> {item.nguoiThucHien}
                                            </div>
                                            {item.xeMuaVao && (
                                                <Link href={`/cars/${item.xeMuaVao.bienSo ? '' : ''}`} className="text-xs font-bold text-violet-400 hover:text-violet-300 hover:underline">
                                                    {item.xeMuaVao.bienSo || item.xeMuaVao.dongXe}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Pagination Controls */}
                {metadata && metadata.totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 pt-4 pb-8">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className={`p-2 rounded-xl border ${page <= 1 ? 'border-slate-800 text-slate-600' : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-xs font-bold text-slate-500">
                            Trang {page} / {metadata.totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(metadata.totalPages, p + 1))}
                            disabled={page >= metadata.totalPages}
                            className={`p-2 rounded-xl border ${page >= metadata.totalPages ? 'border-slate-800 text-slate-600' : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}