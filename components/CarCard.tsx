'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bike, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatTimeAgo, formatStatus } from '@/lib/utils';

export default function CarCard({ car }: { car: any }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Touch handling for swipe
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const isOverdue = car.hoSo?.trangThai === 'QUA_HAN';
    const isSold = car.trangThai === 'DA_BAN';
    const isDeposited = car.soTienCoc > 0 && !isSold;
    const isSelling = !isSold && !isDeposited && (car.trangThai === 'DANG_BAN' || !!car.facebookLink);
    
    // Parse Images
    let images: string[] = [];
    try {
        images = JSON.parse(car.hinhAnh || '[]');
    } catch (e) {
        images = [];
    }

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
        if (isSold) return { label: 'Đã Bán', color: 'bg-green-100 text-green-700 ring-1 ring-green-600/20' };
        if (isDeposited) return { label: 'Đã Cọc', color: 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20' };
        if (isOverdue) return { label: 'Quá Hạn', color: 'bg-red-100 text-red-700 ring-1 ring-red-600/20' };
        if (isSelling) return { label: 'Đang Bán', color: 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20' };
        return { label: formatStatus(car.trangThai), color: 'bg-gray-100 text-gray-600 ring-1 ring-gray-600/20' };
    };

    const status = getStatusBadge();
    
    return (
        <Link href={`/cars/${car.id}`} className="block group h-full">
            <div className={`card-instrument h-full flex flex-col relative
                group-hover:translate-y-[-4px] group-hover:shadow-[0_12px_32px_-8px_rgba(59,130,246,0.2)] dark:group-hover:shadow-[0_12px_32px_-8px_rgba(59,130,246,0.1)]
                ${isOverdue ? 'ring-2 ring-red-500/50' : ''}
            `}>
                {/* Header Badge & Image */}
                <div 
                    className="relative aspect-4/3 bg-gray-100 dark:bg-gray-800 group/image touch-pan-y overflow-hidden"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Dark Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10 opacity-60"></div>

                    {images.length > 0 ? (
                        <>
                            <img 
                                src={images[currentImageIndex]} 
                                alt={`${car.dongXe} - Image ${currentImageIndex + 1}`} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            
                            {hasMultipleImages && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                    {images.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`h-1 rounded-full shadow-sm transition-all duration-300 ${
                                                idx === currentImageIndex 
                                                    ? 'w-4 bg-white' 
                                                    : 'w-1 bg-white/40'
                                            }`} 
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 bg-gray-50 dark:bg-gray-800">
                            <Bike size={48} strokeWidth={1} className="opacity-50" />
                            <span className="text-[10px] font-bold uppercase mt-2 tracking-widest opacity-50">No Image</span>
                        </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-1 z-20">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md border border-white/10 ${status.color}`}>
                            {status.label}
                        </span>
                    </div>

                    <div className="absolute top-3 right-3 z-20">
                        <span className="text-[9px] text-white/90 font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full shadow-lg border border-white/10 tracking-wide">
                            {formatTimeAgo(new Date(car.createdAt))}
                        </span>
                    </div>
                </div>

                {/* Main Info */}
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                        {car.dongXe}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-4">
                         <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{car.namSanXuat}</span>
                         <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{car.mauXe}</span>
                         {car.bienSo && (
                             <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md font-mono border border-blue-100 dark:border-blue-900/30">
                                {car.bienSo}
                             </span>
                         )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-dashed border-gray-100 dark:border-gray-800 flex justify-between items-end">
                        <div>
                            <p className="text-[9px] text-gray-400 uppercase font-bold mb-1 tracking-wider">Giá vốn</p>
                            <p className="font-black text-gray-900 dark:text-white text-xl tracking-tight flex items-baseline gap-0.5">
                                {car.tongGiaMua.toLocaleString()} 
                                <span className="text-[10px] font-normal text-gray-400">₫</span>
                            </p>
                        </div>
                         {car.soTienCoc > 0 && (
                             <div className="text-right">
                                 <p className="text-[9px] text-gray-400 uppercase font-bold mb-1 tracking-wider">Đã cọc</p>
                                 <p className="font-bold text-green-600 dark:text-green-400 text-sm">
                                    +{car.soTienCoc.toLocaleString()}
                                 </p>
                             </div>
                         )}
                    </div>
                </div>

                {/* Overdue Warning Overlay */}
                {isOverdue && (
                    <div className="absolute inset-0 border-2 border-red-500/50 rounded-[24px] pointer-events-none z-30 flex items-center justify-center bg-red-500/5 backdrop-blur-[1px]">
                        <div className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl animate-pulse tracking-widest">
                            QUÁ HẠN
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
