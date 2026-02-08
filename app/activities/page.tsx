'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Activity, Calendar, Clock, Search, Filter } from 'lucide-react';
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

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ['all-activities'],
    queryFn: async () => {
      const res = await fetch('/api/notifications?limit=100');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const filteredNotifications = notifications?.filter(n => 
    n.chiTiet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.nguoiThucHien.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.xeMuaVao?.dongXe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.xeMuaVao?.bienSo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by Date
  const groupedNotifications = filteredNotifications?.reduce((groups, notif) => {
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
    return groups;
  }, {} as Record<string, Notification[]>);

  const getColor = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('thêm') || lower.includes('create') || lower.includes('nhập')) return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    if (lower.includes('sửa') || lower.includes('update')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    if (lower.includes('xóa') || lower.includes('delete')) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    if (lower.includes('bán') || lower.includes('sell')) return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    if (lower.includes('hồ sơ') || lower.includes('docs')) return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  };

  const getActionLabel = (action: string) => {
      // Map generic codes to user friendly labels if needed, or just return action
      return action;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-30 px-4 py-3 shadow-sm border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
            <Link href="/" className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-lg text-gray-800 dark:text-white ml-2 flex items-center">
                <Activity size={20} className="mr-2 text-blue-600" />
                Hoạt Động Hệ Thống
            </h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        
        {/* Search */}
        <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                placeholder="Tìm kiếm hoạt động..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
        </div>

        {/* Content */}
        {isLoading ? (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        ) : !filteredNotifications || filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
                <Activity size={48} className="mx-auto mb-4 opacity-20" />
                <p>Không tìm thấy hoạt động nào</p>
            </div>
        ) : (
            <div className="space-y-8">
                {Object.entries(groupedNotifications || {}).map(([date, items]) => (
                    <div key={date} className="relative">
                        <div className="sticky top-16 z-10 flex justify-center mb-4">
                            <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-white dark:border-gray-700 uppercase tracking-wide">
                                {date}
                            </span>
                        </div>
                        
                        <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 md:ml-6 space-y-6 pb-4">
                            {items.map((item) => (
                                <div key={item.id} className="relative pl-6 md:pl-8 group">
                                    {/* Dot */}
                                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-950 ${getColor(item.hanhDong)} shadow-sm z-10`}></div>
                                    
                                    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 group-hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getColor(item.hanhDong)}`}>
                                                {item.hanhDong}
                                            </span>
                                            <span className="text-[10px] text-gray-400 flex items-center">
                                                <Clock size={10} className="mr-1" />
                                                {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-800 dark:text-white font-medium mb-2">
                                            {item.chiTiet}
                                        </p>

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800 mt-2">
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                <span className="font-bold mr-1">Người thực hiện:</span> {item.nguoiThucHien}
                                            </div>
                                            {item.xeMuaVao && (
                                                <Link href={`/cars/${item.xeMuaVao.bienSo ? '' : ''}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
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
            </div>
        )}
      </div>
    </div>
  );
}