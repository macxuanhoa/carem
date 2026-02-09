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
        <div className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Icon size={18} className="mr-3 text-gray-400"/>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="text-right">
                {isBadge ? (
                     <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide">
                        {formatStatus(value as string)}
                     </span>
                ) : (
                    <>
                        <span className="text-gray-900 dark:text-white font-bold text-sm block">{value}</span>
                        {subValue && <span className="text-blue-500 text-xs font-bold block mt-0.5">{subValue}</span>}
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
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative aspect-video group touch-pan-y"
            >
                {images.length > 0 ? (
                    <>
                        <Image 
                            src={images[currentImageIdx]} 
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 600px"
                            className="object-cover bg-gray-100 dark:bg-gray-800" 
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
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800 relative">
                        <ImageIcon size={48} strokeWidth={1.5} className="mb-2 opacity-50"/>
                        <span className="text-xs font-medium mb-3">Chưa có hình ảnh</span>
                        <button 
                            onClick={handleOpenModal}
                            className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all active:scale-95 flex items-center"
                        >
                            <Plus size={20} className="mr-2" /> Thêm ảnh ngay
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Upload Modal */}
            {showImageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quản Lý Hình Ảnh</h3>
                            <button onClick={() => setShowImageModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <ImageUpload 
                                value={editingImages}
                                onChange={(urls) => setEditingImages(urls)}
                                onRemove={(url) => setEditingImages(prev => prev.filter(x => x !== url))}
                            />
                        </div>

                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl flex justify-end gap-3">
                            <button 
                                onClick={() => setShowImageModal(false)}
                                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handleSaveImages}
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-colors flex items-center disabled:opacity-70"
                            >
                                {isSaving ? 'Đang lưu...' : <><Save size={18} className="mr-2" /> Lưu Thay Đổi</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Main Info Card - Redesigned */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight flex-1 mr-2 capitalize">
                        {car.dongXe}
                    </h2>
                    {car.bienSo && (
                        <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded-lg text-xs font-bold font-mono border border-yellow-200 dark:border-yellow-800 whitespace-nowrap">
                            {car.bienSo}
                        </span>
                    )}
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 font-medium space-x-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                    <div className="flex items-center">
                        <Calendar size={14} className="mr-1.5 text-gray-400"/> {car.namSanXuat}
                    </div>
                    <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400 mr-1.5 border border-gray-300"></div> 
                        <span className="capitalize">{car.mauXe}</span>
                    </div>
                    <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="flex items-center truncate">
                        <MapPin size={14} className="mr-1.5 text-gray-400"/> 
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
                        className={`bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center aspect-square transition-all active:scale-95 ${action.disabled ? 'opacity-50 grayscale' : ''}`}
                    >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center transition-colors ${
                            action.alert ? 'bg-red-100 text-red-600' : 
                            action.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                            action.color === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                            action.color === 'orange' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                            'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                        }`}>
                            <action.icon size={20} strokeWidth={2} />
                        </div>
                        <span className={`text-[10px] font-bold ${action.alert ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                            {action.label}
                        </span>
                    </Link>
                ))}
            </div>

            {/* 4. Details List - Redesigned Header */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800">
                     <h3 className="font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider">Thông tin chi tiết</h3>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                     <DetailRow icon={Users} label="Người bán" value={car.nguoiBan} subValue={car.soDienThoai} />
                     <DetailRow icon={Activity} label="Trạng thái" value={car.trangThai} isBadge />
                     <DetailRow icon={Calendar} label="Ngày nhập" value={new Date(car.createdAt).toLocaleDateString('vi-VN')} />
                     <div className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <ExternalLink size={18} className="mr-3 text-blue-500"/>
                            <span className="text-sm font-medium">Link nguồn</span>
                        </div>
                        {car.facebookLink ? (
                            <a href={car.facebookLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">
                                Xem bài đăng <ExternalLink size={12} className="ml-1"/>
                            </a>
                        ) : (
                            <span className="text-gray-400 text-xs italic">Không có link</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
