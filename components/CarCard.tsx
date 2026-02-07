'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Car, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatTimeAgo, formatStatus } from '@/lib/utils';

export default function CarCard({ car }: { car: any }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    const handlePrevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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
            <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 relative overflow-hidden h-full flex flex-col
                group-hover:shadow-md group-hover:translate-y-[-2px] group-hover:border-blue-200 dark:group-hover:border-blue-800
                ${isOverdue ? 'ring-2 ring-red-500/50' : ''}
            `}>
                {/* Header Badge & Image */}
                <div className="relative aspect-4/3 bg-gray-100 dark:bg-gray-800 group/image">
                    {images.length > 0 ? (
                        <>
                            <img 
                                src={images[currentImageIndex]} 
                                alt={`${car.dongXe} - Image ${currentImageIndex + 1}`} 
                                className="w-full h-full object-cover transition-transform duration-500"
                            />
                            
                            {/* Navigation Arrows - Only show if multiple images */}
                            {hasMultipleImages && (
                                <>
                                    <button 
                                        onClick={handlePrevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 dark:bg-black/50 text-gray-700 dark:text-white opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black/70 shadow-sm"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button 
                                        onClick={handleNextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 dark:bg-black/50 text-gray-700 dark:text-white opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black/70 shadow-sm"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                    
                                    {/* Image Indicator Dots */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity">
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
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-700">
                            <Car size={48} strokeWidth={1.5} />
                            <span className="text-[10px] font-bold uppercase mt-2">Chưa có ảnh</span>
                        </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-1 pointer-events-none">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm backdrop-blur-md ${status.color}`}>
                            {status.label}
                        </span>
                    </div>

                    <div className="absolute top-3 right-3 pointer-events-none">
                        <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-white/20">
                            {formatTimeAgo(new Date(car.createdAt))}
                        </span>
                    </div>
                </div>

                {/* Main Info */}
                <div className="px-4 pt-4 mb-2 flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                        {car.dongXe}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                         <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700 font-medium">Đời {car.namSanXuat}</span>
                         <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">{car.mauXe}</span>
                         {car.bienSo && (
                             <span className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded-md border border-yellow-100 dark:border-yellow-900/30 font-mono font-medium">
                                {car.bienSo}
                             </span>
                         )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3 flex items-center">
                        <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-1.5"></span>
                        Nhập: {new Date(car.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                </div>

                {/* Footer: Price */}
                <div className="mt-auto bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 p-4 flex justify-between items-end">
                     <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5 tracking-wide">Giá vốn</p>
                        <p className="font-bold text-gray-900 dark:text-white text-xl tracking-tight">{car.tongGiaMua.toLocaleString()} <span className="text-xs font-normal text-gray-500">đ</span></p>
                     </div>
                     {car.soTienCoc > 0 && (
                         <div className="text-right">
                             <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Đã cọc</p>
                             <p className="font-bold text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-md border border-green-100 dark:border-green-900/30">
                                +{car.soTienCoc.toLocaleString()}
                             </p>
                         </div>
                     )}
                </div>

                {/* Overdue Warning Overlay */}
                {isOverdue && (
                    <div className="absolute top-0 right-0 pointer-events-none">
                        <div className="bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg shadow-sm">
                            HỒ SƠ QUÁ HẠN
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
