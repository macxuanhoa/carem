'use client';

import Image from 'next/image';
import { 
    Users, Activity, Calendar, MapPin, 
    ExternalLink, Phone 
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ImageUpload from '@/components/ImageUpload';
import { 
    Image as ImageIcon, Edit, X, Save, Plus
} from 'lucide-react';
import { formatStatus } from '@/lib/utils';
import { InfoTabProps, DetailRowProps } from './types';
import Link from 'next/link';
import { 
    FileText, DollarSign, Wrench 
} from 'lucide-react';

function DetailRow({ icon: Icon, label, value, subValue, isBadge }: DetailRowProps) {
    return (
        <div className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center text-slate-500 dark:text-slate-400">
                <Icon size={18} className="mr-3 text-slate-400"/>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="text-right">
                {isBadge ? (
                     <span className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide">
                        {formatStatus(value as string)}
                     </span>
                ) : (
                    <>
                        <span className="text-slate-900 dark:text-white font-bold text-sm block">{value}</span>
                        {subValue && <span className="text-violet-500 text-xs font-bold block mt-0.5">{subValue}</span>}
                    </>
                )}
            </div>
        </div>
    );
}

export default function InfoTab({ car, isOverdue, userRole }: InfoTabProps) {
    const router = useRouter();
    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingImages, setEditingImages] = useState<string[]>([]);

    // Touch handling for swipe
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
             // Next image
             setCurrentImageIdx(prev => prev === images.length - 1 ? 0 : prev + 1);
        }
        if (isRightSwipe) {
            // Prev image
            setCurrentImageIdx(prev => prev === 0 ? images.length - 1 : prev - 1);
        }
    };
    
    // Parse images safely
    let images: string[] = [];
    try {
        images = car.hinhAnh || [];
        // Ensure it is array
        if (!Array.isArray(images)) images = [];
    } catch (e) {
        images = [];
    }

    const handleOpenModal = () => {
        setEditingImages([...images]);
        setShowImageModal(true);
    };

    const handleSaveImages = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/cars/${car.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hinhAnh: editingImages })
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success('Cập nhật hình ảnh thành công');
            setShowImageModal(false);
            router.refresh();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lưu ảnh');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4 p-4">
            {/* 1. Image Carousel - Improved */}
            <div 
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/50 overflow-hidden relative aspect-video group touch-pan-y"
            >
                {images.length > 0 ? (
                    <>
                        <Image 
                            src={images[currentImageIdx]} 
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 600px"
                            className="object-cover bg-slate-100 dark:bg-slate-800" 
                            alt={`Car ${currentImageIdx}`}
                            priority
                        />
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md z-10">
                            {currentImageIdx + 1} / {images.length}
                        </div>
                        
                        {/* Quick Edit Image Button */}
                        <button 
                            onClick={handleOpenModal}
                            className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Edit size={16} />
                        </button>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800 relative">
                        <ImageIcon size={48} strokeWidth={1.5} className="mb-2 opacity-50"/>
                        <span className="text-xs font-medium mb-3">Chưa có hình ảnh</span>
                        <button 
                            onClick={handleOpenModal}
                            className="px-6 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-2xl shadow-md border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all active:scale-95 flex items-center"
                        >
                            <Plus size={20} className="mr-2" /> Thêm ảnh ngay
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Upload Modal */}
            {showImageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quản Lý Hình Ảnh</h3>
                            <button onClick={() => setShowImageModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <ImageUpload 
                                value={editingImages}
                                onChange={(urls) => setEditingImages(urls)}
                                onRemove={(url) => setEditingImages(prev => prev.filter(x => x !== url))}
                            />
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end gap-3">
                            <button 
                                onClick={() => setShowImageModal(false)}
                                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handleSaveImages}
                                disabled={isSaving}
                                className="px-4 py-2 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200 dark:shadow-violet-900/30 transition-colors flex items-center disabled:opacity-70"
                            >
                                {isSaving ? 'Đang lưu...' : <><Save size={18} className="mr-2" /> Lưu Thay Đổi</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Main Info Card - Redesigned */}
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/50">
                <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight flex-1 mr-2 capitalize">
                        {car.dongXe}
                    </h2>
                    {car.bienSo && (
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-2 py-1 rounded-lg text-xs font-bold font-mono border border-amber-200 dark:border-amber-800 whitespace-nowrap">
                            {car.bienSo}
                        </span>
                    )}
                </div>
                
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 font-medium space-x-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <div className="flex items-center">
                        <Calendar size={14} className="mr-1.5 text-slate-400"/> {car.namSanXuat}
                    </div>
                    <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-slate-400 mr-1.5 border border-slate-300"></div> 
                        <span className="capitalize">{car.mauXe}</span>
                    </div>
                    <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
                    <div className="flex items-center truncate">
                        <MapPin size={14} className="mr-1.5 text-slate-400"/> 
                        <span className="truncate">{car.tinhThanh || 'TQ'}</span>
                    </div>
                </div>
            </div>

            {/* 3. Quick Actions Grid - Cleaned up */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { icon: FileText, label: 'Hồ Sơ', href: `/cars/${car.id}/docs`, color: 'blue', alert: isOverdue },
                    // Hide Capital & Expenses for Staff
                    ...(userRole === 'ADMIN' ? [
                        { icon: Users, label: 'Góp Vốn', href: `/cars/${car.id}/investors/new`, color: 'green' },
                        { icon: Wrench, label: 'Chi Phí', href: `/cars/${car.id}/expenses`, color: 'orange' }
                    ] : []),
                    { icon: DollarSign, label: 'Bán Xe', href: `/cars/${car.id}/sell`, color: 'purple', disabled: car.trangThai === 'DA_BAN' }
                ].map((action, idx) => (
                    <Link 
                        key={idx} 
                        href={action.disabled ? '#' : action.href}
                        className={`bg-white dark:bg-slate-900/50 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm flex flex-col items-center justify-center aspect-square transition-all active:scale-95 ${action.disabled ? 'opacity-50 grayscale' : ''}`}
                    >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center transition-colors ${
                            action.alert ? 'bg-red-100 text-red-600' : 
                            action.color === 'blue' ? 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400' :
                            action.color === 'green' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                            action.color === 'orange' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                            'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:text-fuchsia-400'
                        }`}>
                            <action.icon size={20} strokeWidth={2} />
                        </div>
                        <span className={`text-[10px] font-bold ${action.alert ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>
                            {action.label}
                        </span>
                    </Link>
                ))}
            </div>

            {/* 4. Details List - Redesigned Header */}
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/50 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800">
                     <h3 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">Thông tin chi tiết</h3>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                     <DetailRow icon={Users} label="Người bán" value={car.nguoiBan} subValue={car.soDienThoai} />
                     <DetailRow icon={Activity} label="Trạng thái" value={car.trangThai} isBadge />
                     <DetailRow icon={Calendar} label="Ngày nhập" value={new Date(car.createdAt).toLocaleDateString('vi-VN')} />
                     <div className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <ExternalLink size={18} className="mr-3 text-violet-500"/>
                            <span className="text-sm font-medium">Link nguồn</span>
                        </div>
                        {car.facebookLink ? (
                            <a href={car.facebookLink} target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 text-xs font-bold hover:underline flex items-center bg-violet-50 dark:bg-violet-900/20 px-3 py-1.5 rounded-lg">
                                Xem bài đăng <ExternalLink size={12} className="ml-1"/>
                            </a>
                        ) : (
                            <span className="text-slate-400 text-xs italic">Không có link</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
