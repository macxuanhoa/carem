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
        <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
            <Search size={20} />
        </div>
        <Input 
            id="search-input-field"
            type="text" 
            placeholder="Tìm tên xe, biển số, người bán..." 
            defaultValue={searchParams.get('q')?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-blue-100 dark:focus-visible:ring-blue-900/30 shadow-sm"
        />
    </div>
  );
}
