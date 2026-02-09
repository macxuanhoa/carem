import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  href: string;
  icon: LucideIcon;
  value: number;
  label: string;
  color: 'blue' | 'purple' | 'red';
}

export default function StatCard({ href, icon: Icon, value, label, color }: StatCardProps) {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
      shadow: 'hover:shadow-[0_10px_30px_-4px_rgba(37,99,235,0.1)]',
      overlay: 'bg-blue-50/50 dark:bg-blue-900/10',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      hover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
      shadow: 'hover:shadow-[0_10px_30px_-4px_rgba(168,85,247,0.1)]',
      overlay: 'bg-purple-50/50 dark:bg-purple-900/10',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-500 dark:text-red-400',
      hover: 'group-hover:text-red-500 dark:group-hover:text-red-400',
      shadow: 'hover:shadow-[0_10px_30px_-4px_rgba(239,68,68,0.1)]',
      overlay: 'bg-red-50/50 dark:bg-red-900/10',
    },
  };

  const style = colorStyles[color];

  return (
    <Link href={href} className={`group bg-white dark:bg-slate-900 rounded-4xl p-5 border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ${style.shadow} transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center justify-center gap-3 relative overflow-hidden`}>
        <div className={`absolute inset-0 ${style.overlay} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        <div className={`w-14 h-14 rounded-2xl ${style.bg} ${style.text} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 z-10`}>
            <Icon size={28} strokeWidth={2} />
        </div>
        <div className="z-10">
            <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{value}</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ${style.hover} transition-colors`}>{label}</p>
        </div>
    </Link>
  );
}
