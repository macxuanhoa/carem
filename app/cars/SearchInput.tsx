'use client';

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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors duration-300" size={20} />
        <input 
            type="text" 
            placeholder="Tìm tên xe, biển số, người bán..." 
            defaultValue={searchParams.get('q')?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
            className="relative w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-base font-medium text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-300 dark:focus:border-blue-700 transition-all shadow-sm focus:shadow-md outline-none"
        />
    </div>
  );
}
