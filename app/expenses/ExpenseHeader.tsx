'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function ExpenseHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = useDebouncedCallback((term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
          params.set('q', term);
      } else {
          params.delete('q');
      }
      router.replace(`/expenses?${params.toString()}`);
  }, 300);

  useEffect(() => {
      if (searchParams.get('q')) setIsSearchOpen(true);
  }, [searchParams]);

  return (
    <div className="flex justify-between items-center mb-4 h-10">
        {!isSearchOpen ? (
            <>
                <h1 className="text-2xl font-bold text-gray-800">Quản Lý Chi Phí</h1>
                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="bg-gray-50 p-2.5 rounded-full text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
                >
                    <Search size={20} strokeWidth={2.5}/>
                </button>
            </>
        ) : (
            <div className="flex w-full items-center animate-in fade-in slide-in-from-right-10 duration-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text"
                        autoFocus
                        placeholder="Tìm loại chi, xe, ghi chú..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        className="w-full bg-gray-100 rounded-xl py-2 pl-9 pr-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <button 
                    onClick={() => {
                        setIsSearchOpen(false);
                        setQuery('');
                        handleSearch('');
                    }}
                    className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
            </div>
        )}
    </div>
  );
}
