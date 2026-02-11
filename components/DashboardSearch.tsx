'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/cars?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
        <button type="submit" className="absolute left-0 top-0 bottom-0 px-4 text-slate-400 group-focus-within:text-violet-500 transition-colors z-10 flex items-center">
            <Search size={18} />
        </button>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm xe, biển số..." 
          className="w-full bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner focus:shadow-lg outline-none"
        />
    </form>
  );
}
