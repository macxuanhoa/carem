'use client';

import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchInput() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(`/cars?${params.toString()}`);
  }, 300);

  return (
    <div className="relative group mb-4">
        <div className="absolute inset-0 bg-violet-600/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">
            <Search size={20} />
        </div>
        <Input 
            id="search-input-field"
            type="text" 
            placeholder="Tìm tên xe, biển số, người bán..." 
            defaultValue={searchParams.get('q')?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-violet-500/20 dark:focus-visible:ring-violet-500/20 shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400"
        />
    </div>
  );
}
