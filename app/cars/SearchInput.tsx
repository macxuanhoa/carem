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
        {/* Nút tìm kiếm (Icon) có thể click được */}
        <button 
            type="button" 
            className="absolute left-0 top-0 bottom-0 px-4 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors duration-300 z-10 flex items-center justify-center"
            onClick={() => {
                // Logic xử lý khi click vào icon nếu cần, ví dụ focus vào input hoặc submit
                const input = document.getElementById('search-input-field');
                input?.focus();
            }}
        >
            <Search size={20} />
        </button>
        <input 
            id="search-input-field"
            type="text" 
            placeholder="Tìm tên xe, biển số, người bán..." 
            defaultValue={searchParams.get('q')?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
            className="relative w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-base font-medium text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-300 dark:focus:border-blue-700 transition-all shadow-sm focus:shadow-md outline-none"
        />
    </div>
  );
}
