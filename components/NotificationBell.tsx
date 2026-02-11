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
    if (lower.includes('thêm') || lower.includes('create') || lower.includes('nhập')) return 'bg-emerald-500/20 text-emerald-500';
    if (lower.includes('sửa') || lower.includes('update')) return 'bg-blue-500/20 text-blue-500';
    if (lower.includes('xóa') || lower.includes('delete')) return 'bg-red-500/20 text-red-500';
    if (lower.includes('bán') || lower.includes('sell')) return 'bg-violet-500/20 text-violet-500';
    if (lower.includes('hồ sơ') || lower.includes('docs')) return 'bg-amber-500/20 text-amber-500';
    return 'bg-slate-500/20 text-slate-500';
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all relative active:scale-95 shadow-sm"
      >
        <Bell size={20} strokeWidth={2} />
        {/* Always show red dot for now to indicate "live" nature, or if we have new items logic */}
        <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden ring-1 ring-black/50"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Thông báo hoạt động</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500 text-xs">Đang tải...</div>
              ) : notifications?.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">Chưa có thông báo nào</div>
              ) : (
                notifications?.map((notif) => (
                  <div key={notif.id} className="p-3 rounded-xl hover:bg-white/5 transition-colors flex items-start gap-3 group border border-transparent hover:border-white/5">
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getColor(notif.hanhDong)}`}>
                      {getIcon(notif.hanhDong)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 font-bold mb-0.5 flex justify-between">
                         <span>{notif.nguoiThucHien}</span>
                         <span className="text-[10px] font-normal opacity-70">{formatTimeAgo(notif.createdAt)}</span>
                      </p>
                      <p className="text-sm font-medium text-slate-200 leading-snug line-clamp-2">
                        {notif.chiTiet}
                      </p>
                      {notif.xeMuaVao && (
                          <div className="mt-1.5 flex items-center gap-2">
                              <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border border-white/10">
                                  {notif.xeMuaVao.bienSo || 'N/A'}
                              </span>
                              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{notif.xeMuaVao.dongXe}</span>
                          </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-2 border-t border-white/5 bg-slate-900 text-center">
                <Link href="/activities" className="text-xs font-bold text-violet-400 hover:text-violet-300 block py-1 transition-colors">
                    Xem tất cả hoạt động
                </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}