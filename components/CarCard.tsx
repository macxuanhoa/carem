'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { Bike, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatTimeAgo, formatStatus } from '@/lib/utils';
import { CarWithRelations } from '@/lib/types';

export default function CarCard({ car, priority = false }: { car: CarWithRelations; priority?: boolean }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Touch handling for swipe
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const isOverdue = car.hoSo?.trangThai === 'QUA_HAN';
    const isSold = car.trangThai === 'DA_BAN';
    const isDeposited = car.soTienCoc > 0 && !isSold;
    const isSelling = !isSold && !isDeposited && (car.trangThai === 'DANG_BAN' || !!car.facebookLink);
    
    // Images are now String[]
    const images = car.hinhAnh || [];

    const hasMultipleImages = images.length > 1;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
            // Next image
            e.preventDefault();
            e.stopPropagation();
            setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
        }
        if (isRightSwipe) {
            // Prev image
            e.preventDefault();
            e.stopPropagation();
            setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
        }
    };
    
    // Helper for status badge
    const getStatusBadge = () => {
        if (isSold) return { label: 'Đã Bán', color: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300' };
        if (isDeposited) return { label: 'Đã Cọc', color: 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-600/20 dark:bg-cyan-900/30 dark:text-cyan-300' };
        if (isOverdue) return { label: 'Quá Hạn', color: 'bg-rose-100 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-300' };
        if (isSelling) return { label: 'Đang Bán', color: 'bg-violet-100 text-violet-700 ring-1 ring-violet-600/20 dark:bg-violet-900/30 dark:text-violet-300' };
        return { label: formatStatus(car.trangThai), color: 'bg-slate-100 text-slate-600 ring-1 ring-slate-600/20 dark:bg-slate-800 dark:text-slate-400' };
    };

    const status = getStatusBadge();
    
    return (
        <Link href={`/cars/${car.id}`} className="block group h-full">
            <div className={`bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/50 transition-all duration-300 relative overflow-hidden h-full flex flex-col
                group-hover:shadow-md group-hover:translate-y-[-2px] group-hover:border-violet-200 dark:group-hover:border-violet-800/50
                ${isOverdue ? 'ring-2 ring-rose-500/50' : ''}
            `}>
                {/* Header Badge & Image */}
                <div 
                    className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800 group/image touch-pan-y"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {images.length > 0 ? (
                        <>
                            <Image 
                                src={images[currentImageIndex]} 
                                alt={`${car.dongXe} - Image ${currentImageIndex + 1}`} 
                                fill
                                priority={priority && currentImageIndex === 0} // Only priority if passed prop is true
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Optimization for Responsive
                                className="object-cover transition-transform duration-500 will-change-transform" // Hardware acceleration hint
                            />
                            
                            {/* Navigation Arrows - Removed as per request */}
                            {hasMultipleImages && (
                                <>
                                    {/* Image Indicator Dots */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-100 transition-opacity">
                                        {images.map((_, idx) => (
                                            <div 
                                                key={idx} 
                                                className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${
                                                    idx === currentImageIndex 
                                                        ? 'bg-white scale-125' 
                                                        : 'bg-white/50'
                                                }`} 
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                            <Bike size={48} strokeWidth={1.5} />
                            <span className="text-[10px] font-bold uppercase mt-2">Chưa có ảnh</span>
                        </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-1 pointer-events-none">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm backdrop-blur-md ${status.color}`}>
                            {status.label}
                        </span>
                    </div>

                    <div className="absolute top-3 right-3 pointer-events-none">
                        <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-white/20">
                            {formatTimeAgo(new Date(car.createdAt))}
                        </span>
                    </div>
                </div>

                {/* Main Info */}
                <div className="px-4 pt-4 mb-2 flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-2 line-clamp-2">
                        {car.dongXe}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
                         <span className="bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700 font-medium">Đời {car.namSanXuat}</span>
                         <span className="bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">{car.mauXe}</span>
                         {car.bienSo && (
                             <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 px-2 py-1 rounded-md border border-amber-100 dark:border-amber-900/30 font-mono font-medium">
                                {car.bienSo}
                             </span>
                         )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3 flex items-center">
                        <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mr-1.5"></span>
                        Nhập: {new Date(car.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                </div>

                {/* Footer: Price */}
                <div className="mt-auto bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 p-4 flex justify-between items-end">
                     <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5 tracking-wide">Giá vốn</p>
                        <p className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">{car.tongGiaMua.toLocaleString()} <span className="text-xs font-normal text-slate-500">đ</span></p>
                     </div>
                     {car.soTienCoc > 0 && (
                         <div className="text-right">
                             <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Đã cọc</p>
                             <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                                +{car.soTienCoc.toLocaleString()}
                             </p>
                         </div>
                     )}
                </div>

                {/* Overdue Warning Overlay */}
                {isOverdue && (
                    <div className="absolute top-0 right-0 pointer-events-none">
                        <div className="bg-rose-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg shadow-sm">
                            HỒ SƠ QUÁ HẠN
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
