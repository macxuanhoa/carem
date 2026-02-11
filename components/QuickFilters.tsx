'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, Clock, TrendingUp, AlertTriangle, CheckCircle, Bike } from 'lucide-react';

export default function QuickFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentStatus = searchParams.get('status') || 'all';

  const mainFilters = [
    { label: 'Tất Cả', value: 'all', icon: Bike, color: 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800', activeColor: 'bg-violet-600 border-violet-600 shadow-violet-500/30' },
    { label: 'Đang Bán', value: 'selling', icon: TrendingUp, color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900/30', activeColor: 'bg-violet-600 border-violet-600 shadow-violet-500/30' },
    { label: 'Đã Cọc', value: 'deposited', icon: CheckCircle, color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-900/30', activeColor: 'bg-cyan-600 border-cyan-600 shadow-cyan-500/30' },
    { label: 'Đã Bán', value: 'sold', icon: CheckCircle, color: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-100 dark:border-fuchsia-900/30', activeColor: 'bg-fuchsia-600 border-fuchsia-600 shadow-fuchsia-500/30' },
  ];

  const docFilters = [
    { label: 'Hồ Sơ', value: 'overdue', icon: FileText, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30', activeColor: 'bg-indigo-600 border-indigo-600 shadow-indigo-500/30' },
  ];

  const handleStatus = (value: string) => {
      const params = new URLSearchParams(searchParams);
      // Prevent toggle back to 'all' - Always set the clicked value
      if (params.get('status') === value) {
          return; // Do nothing if already active
      }
      
      params.set('status', value);
      router.replace(`/cars?${params.toString()}`);
  };

  return (
    <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-2 overscroll-x-contain no-scrollbar">
        {/* Main Filters */}
        {mainFilters.map((f) => {
            const isActive = currentStatus === f.value;
            const Icon = f.icon;
            
            return (
                <button
                    key={f.label}
                    onClick={() => handleStatus(f.value)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap shrink-0 snap-start
                        ${isActive 
                            ? `${f.activeColor} text-white shadow-md` 
                            : f.color
                        }
                    `}
                >
                    <Icon size={14} strokeWidth={2.5} />
                    <span>{f.label}</span>
                </button>
            );
        })}

        {/* Doc Filters */}
        {docFilters.map((f) => {
            const isActive = currentStatus === f.value;
            const Icon = f.icon;
            
            return (
                <button
                    key={f.label}
                    onClick={() => handleStatus(f.value)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap shrink-0 snap-start
                        ${isActive 
                            ? `${f.activeColor} text-white shadow-md` 
                            : f.color
                        }
                    `}
                >
                    <Icon size={14} strokeWidth={2.5} />
                    <span>{f.label}</span>
                </button>
            );
        })}
    </div>
  );
}
