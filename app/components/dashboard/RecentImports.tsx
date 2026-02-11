import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bike } from 'lucide-react';
import { formatCurrency, formatTimeAgo, formatStatus } from '@/lib/utils';

interface RecentImportsProps {
  cars: any[];
}

export default function RecentImports({ cars }: RecentImportsProps) {
  return (
    <section>
        <div className="flex justify-between items-end mb-6 px-2">
            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Xe Mới Nhập</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">Cập nhật theo thời gian thực</p>
            </div>
            <Link href="/cars" className="group flex items-center text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-4 py-2 rounded-xl transition-all hover:bg-violet-100 dark:hover:bg-violet-900/40 active:scale-95">
                Xem tất cả <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
        
        <div className="space-y-4">
            {cars.map(car => {
                const image = car.hinhAnh && car.hinhAnh.length > 0 ? car.hinhAnh[0] : null;

                return (
                <Link key={car.id} href={`/cars/${car.id}`} className="block bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl p-4 border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-lg hover:shadow-violet-500/10 dark:hover:shadow-none transition-all duration-300 group hover:-translate-y-0.5">
                    <div className="flex gap-4 items-center">
                        {/* Image - Fixed Size */}
                        <div className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center font-bold text-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 overflow-hidden relative shadow-inner">
                            {image ? (
                                <div className="relative w-full h-full">
                                    <Image 
                                        src={image} 
                                        fill
                                        sizes="64px"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                        alt={car.dongXe} 
                                    />
                                </div>
                            ) : (
                                <Bike size={24} strokeWidth={1.5} />
                            )}
                        </div>

                        {/* Info & Status - Flexible */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-base text-slate-800 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate pr-2">
                                    {car.dongXe}
                                </h4>
                                <p className="font-black text-sm text-violet-600 dark:text-violet-400 tracking-tight whitespace-nowrap">
                                    {formatCurrency(car.tongGiaMua || 0)}
                                </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider border border-slate-200 dark:border-slate-700 truncate max-w-[100px] sm:max-w-none">
                                        {car.bienSo || 'CHƯA CÓ'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium flex items-center whitespace-nowrap shrink-0">
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mr-2"></span>
                                        {formatTimeAgo(car.createdAt)}
                                    </span>
                                </div>
                                
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ml-2 shrink-0 ${
                                    car.trangThai === 'DA_BAN' ? 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100 dark:bg-fuchsia-900/20 dark:text-fuchsia-400 dark:border-fuchsia-900/30' :
                                    car.trangThai === 'DANG_BAN' ? 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-900/30' :
                                    'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                }`}>
                                    {formatStatus(car.trangThai)}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            )})}
        </div>
    </section>
  );
}
