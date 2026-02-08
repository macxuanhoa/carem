'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, Clock, TrendingUp, AlertTriangle, CheckCircle, Car } from 'lucide-react';

export default function QuickFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentStatus = searchParams.get('status') || 'all';

  const mainFilters = [
    { label: 'Tất Cả', value: 'all', icon: Car, color: 'text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800' },
    { label: 'Đang Bán', value: 'selling', icon: TrendingUp, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30' },
    { label: 'Đã Cọc', value: 'deposited', icon: CheckCircle, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' },
    { label: 'Đã Bán', value: 'sold', icon: CheckCircle, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30' },
  ];

  const docFilters = [
    { label: 'Hồ Sơ', value: 'overdue', icon: FileText, color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30' },
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
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white shadow-md' 
                            : f.color || 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
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
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white shadow-md' 
                            : f.color || 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
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
