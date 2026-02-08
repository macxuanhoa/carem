'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Plus, Edit, Trash, DollarSign, FileText, Wrench, Info, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimeAgo } from '@/lib/utils';
import Link from 'next/link';

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

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    refetchInterval: 10000, // Poll every 10s
  });

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('thêm') || lower.includes('create') || lower.includes('nhập')) return <Plus size={16} />;
    if (lower.includes('sửa') || lower.includes('update') || lower.includes('cập nhật')) return <Edit size={16} />;
    if (lower.includes('xóa') || lower.includes('delete')) return <Trash size={16} />;
    if (lower.includes('bán') || lower.includes('sell')) return <DollarSign size={16} />;
    if (lower.includes('hồ sơ') || lower.includes('docs')) return <FileText size={16} />;
    if (lower.includes('chi phí') || lower.includes('expense')) return <Wrench size={16} />;
    return <Activity size={16} />;
  };

  const getColor = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('thêm') || lower.includes('create') || lower.includes('nhập')) return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    if (lower.includes('sửa') || lower.includes('update')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    if (lower.includes('xóa') || lower.includes('delete')) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    if (lower.includes('bán') || lower.includes('sell')) return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    if (lower.includes('hồ sơ') || lower.includes('docs')) return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all relative active:scale-95 shadow-sm"
      >
        <Bell size={20} strokeWidth={2} />
        {/* Always show red dot for now to indicate "live" nature, or if we have new items logic */}
        <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-md">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Thông báo hoạt động</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {isLoading ? (
                <div className="p-8 text-center text-gray-400 text-xs">Đang tải...</div>
              ) : notifications?.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">Chưa có thông báo nào</div>
              ) : (
                notifications?.map((notif) => (
                  <div key={notif.id} className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-start gap-3 group">
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getColor(notif.hanhDong)}`}>
                      {getIcon(notif.hanhDong)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-0.5 flex justify-between">
                         <span>{notif.nguoiThucHien}</span>
                         <span className="text-[10px] font-normal opacity-70">{formatTimeAgo(notif.createdAt)}</span>
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white leading-snug line-clamp-2">
                        {notif.chiTiet}
                      </p>
                      {notif.xeMuaVao && (
                          <div className="mt-1.5 flex items-center gap-2">
                              <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border border-gray-200 dark:border-gray-700">
                                  {notif.xeMuaVao.bienSo || 'N/A'}
                              </span>
                              <span className="text-[10px] text-gray-400 truncate max-w-[120px]">{notif.xeMuaVao.dongXe}</span>
                          </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-center">
                <Link href="/activities" className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 block py-1">
                    Xem tất cả hoạt động
                </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}