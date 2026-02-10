import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  href: string;
  icon: LucideIcon;
  value: number;
  label: string;
  color: 'violet' | 'fuchsia' | 'cyan' | 'indigo';
}

export default function StatCard({ href, icon: Icon, value, label, color }: StatCardProps) {
  const colorStyles = {
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      text: 'text-violet-600 dark:text-violet-400',
      hover: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
      shadow: 'hover:shadow-[0_10px_30px_-4px_rgba(139,92,246,0.2)]',
      overlay: 'bg-violet-50/50 dark:bg-violet-900/10',
      border: 'border-violet-100 dark:border-violet-800/50'
    },
    fuchsia: {
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
      text: 'text-fuchsia-600 dark:text-fuchsia-400',
      hover: 'group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400',
      shadow: 'hover:shadow-[0_10px_30px_-4px_rgba(217,70,239,0.2)]',
      overlay: 'bg-fuchsia-50/50 dark:bg-fuchsia-900/10',
      border: 'border-fuchsia-100 dark:border-fuchsia-800/50'
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      text: 'text-cyan-600 dark:text-cyan-400',
      hover: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
      shadow: 'hover:shadow-[0_10px_30px_-4px_rgba(6,182,212,0.2)]',
      overlay: 'bg-cyan-50/50 dark:bg-cyan-900/10',
      border: 'border-cyan-100 dark:border-cyan-800/50'
    },
    indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        text: 'text-indigo-600 dark:text-indigo-400',
        hover: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
        shadow: 'hover:shadow-[0_10px_30px_-4px_rgba(99,102,241,0.2)]',
        overlay: 'bg-indigo-50/50 dark:bg-indigo-900/10',
        border: 'border-indigo-100 dark:border-indigo-800/50'
    },
  };

  const style = colorStyles[color];

  return (
    <Link href={href} className={`group bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border ${style.border} shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ${style.shadow} transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center justify-center gap-2 relative overflow-hidden h-32`}>
        <div className={`absolute inset-0 ${style.overlay} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.text} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 z-10`}>
            <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className="z-10">
            <p className="text-2xl font-black text-slate-800 dark:text-white leading-none mb-1">{value}</p>
            <p className={`text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ${style.hover} transition-colors`}>{label}</p>
        </div>
    </Link>
  );
}
