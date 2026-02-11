import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Đang tải dữ liệu...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 min-h-[200px] animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
        <div className="w-12 h-12 rounded-full border-4 border-violet-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">{text}</p>
    </div>
  );
}