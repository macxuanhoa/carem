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
            <Link href="/cars" className="group flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl transition-all hover:bg-blue-100 dark:hover:bg-blue-900/40 active:scale-95">
                Xem tất cả <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
        
        <div className="space-y-4">
            {cars.map(car => {
                const image = car.hinhAnh && car.hinhAnh.length > 0 ? car.hinhAnh[0] : null;

                return (
                <Link key={car.id} href={`/cars/${car.id}`} className="block bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 group hover:-translate-y-0.5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center font-bold text-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 overflow-hidden relative shadow-inner">
                                {image ? (
                                    <div className="relative w-full h-full">
                                        <Image 
                                            src={image} 
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                            alt={car.dongXe} 
                                        />
                                    </div>
                                ) : (
                                    <Bike size={24} strokeWidth={1.5} />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{car.dongXe}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider border border-slate-200 dark:border-slate-700">
                                        {car.bienSo || 'CHƯA CÓ BIỂN'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium flex items-center">
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mr-2"></span>
                                        {formatTimeAgo(car.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <p className="font-black text-base text-blue-600 dark:text-blue-400 tracking-tight">{formatCurrency(car.tongGiaMua || 0)}</p>
                            <div className="mt-1.5 flex justify-end">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                    car.trangThai === 'DA_BAN' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' :
                                    car.trangThai === 'DANG_BAN' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' :
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
