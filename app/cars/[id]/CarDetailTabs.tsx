'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ImageUpload from '@/components/ImageUpload';
import { 
  Badge, Users, DollarSign, FileText, 
  Calendar, MapPin, Activity, 
  CreditCard, Wrench, ShieldAlert, CheckCircle, Clock,
  ArrowRight, Image as ImageIcon,
  ChevronLeft, ChevronRight, Phone, ExternalLink, Edit, X, Save, Plus
} from 'lucide-react';

// Deal Timeline Component
function DealTimeline({ status, deposit, isSold }: { status: string, deposit: number, isSold: boolean }) {
    const steps = [
        { label: 'Nhập Xe', active: true },
        { label: 'Sẵn Sàng', active: status !== 'TIM_THAY' },
        { label: 'Có Cọc', active: deposit > 0 || isSold },
        { label: 'Đã Bán', active: isSold }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 px-4 py-4 shadow-sm border-b border-gray-100 dark:border-gray-800">
             <div className="flex items-center justify-between relative max-w-sm mx-auto">
                <div className="absolute left-0 top-[11px] w-full h-1 bg-gray-100 dark:bg-gray-800 z-0 rounded-full"></div>
                <div className="absolute left-0 top-[11px] h-1 bg-green-500 z-0 rounded-full transition-all duration-1000 ease-out shadow-sm"
                     style={{ 
                         width: isSold ? '100%' : deposit > 0 ? '66%' : status !== 'TIM_THAY' ? '33%' : '0%' 
                     }}
                ></div>

                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center relative z-10">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white dark:bg-gray-900 ${
                            step.active 
                            ? 'border-green-500 scale-110' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}>
                            {step.active && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
                        </div>
                        <span className={`text-[9px] font-bold mt-1.5 uppercase tracking-wide ${
                            step.active ? 'text-green-600 dark:text-green-500' : 'text-gray-300 dark:text-gray-600'
                        }`}>
                            {step.label}
                        </span>
                    </div>
                ))}
             </div>
        </div>
    );
}

export default function CarDetailTabs({ car, totalGop, totalChiPhi, isOverdue, userRole }: any) {
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
      { id: 'info', label: 'Thông tin' },
      // Only show Finance tab if Admin
      ...(userRole === 'ADMIN' ? [{ id: 'finance', label: 'Tài chính' }] : []),
      { id: 'records', label: 'Hồ sơ' }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen font-sans pb-20">
        <DealTimeline status={car.trangThai} deposit={car.soTienCoc} isSold={car.trangThai === 'DA_BAN'} />

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-[57px] z-20 shadow-sm">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                        activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'info' && <InfoTab car={car} isOverdue={isOverdue} userRole={userRole} />}
            {activeTab === 'finance' && <FinanceTab car={car} totalGop={totalGop} totalChiPhi={totalChiPhi} />}
            {activeTab === 'records' && <RecordsTab car={car} isOverdue={isOverdue} />}
        </div>
    </div>
  );
}

function InfoTab({ car, isOverdue, userRole }: any) {
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
        images = JSON.parse(car.hinhAnh || '[]');
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
                body: JSON.stringify({ hinhAnh: JSON.stringify(editingImages) })
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
                        <img 
                            src={images[currentImageIdx]} 
                            className="w-full h-full object-cover bg-gray-100 dark:bg-gray-800" 
                            alt={`Car ${currentImageIdx}`}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image'; // Fallback
                            }}
                        />
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                            {currentImageIdx + 1} / {images.length}
                        </div>
                        
                        {/* Quick Edit Image Button */}
                        <button 
                            onClick={handleOpenModal}
                            className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Edit size={16} />
                        </button>
                        
                        {/* Navigation Arrows - Always Visible and Bigger */}
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIdx(prev => prev === 0 ? images.length - 1 : prev - 1);
                                    }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/30 hover:bg-white/50 text-white backdrop-blur-md transition-all shadow-lg active:scale-95"
                                >
                                    <ChevronLeft size={28} strokeWidth={2.5} />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIdx(prev => prev === images.length - 1 ? 0 : prev + 1);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/30 hover:bg-white/50 text-white backdrop-blur-md transition-all shadow-lg active:scale-95"
                                >
                                    <ChevronRight size={28} strokeWidth={2.5} />
                                </button>
                            </>
                        )}
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
                     <DetailRow icon={Users} label="Người bán" value={car.nguoiBan} subValue={car.sdtNguoiBan} />
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

import { formatStatus } from '@/lib/utils';

function DetailRow({ icon: Icon, label, value, subValue, isBadge }: any) {
    return (
        <div className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Icon size={18} className="mr-3 text-gray-400"/>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="text-right">
                {isBadge ? (
                     <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide">
                        {formatStatus(value)}
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

function FinanceTab({ car, totalGop, totalChiPhi }: any) {
    return (
        <div className="p-4 space-y-4">
             {/* Main Financial Card */}
             <div className="bg-linear-to-br from-gray-900 to-black text-white p-6 rounded-3xl shadow-xl shadow-gray-200 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <div className="relative z-10">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Tổng Giá Mua</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <h2 className="text-3xl font-bold tracking-tight">{car.tongGiaMua.toLocaleString()}</h2>
                        <span className="text-sm font-medium text-gray-500">VNĐ</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                        <div>
                             <p className="text-green-400 text-[10px] uppercase font-bold mb-1">Đã Cọc</p>
                             <p className="font-bold text-lg">{car.soTienCoc.toLocaleString()}</p>
                        </div>
                         <div>
                             <p className="text-blue-400 text-[10px] uppercase font-bold mb-1">Đã Chuyển</p>
                             <p className="font-bold text-lg">{car.soTienDaChuyen.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
             </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Users size={14} /></div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Vốn Góp</p>
                    </div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{totalGop.toLocaleString()}</p>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min((totalGop / car.tongGiaMua) * 100, 100)}%` }}></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600"><Wrench size={14} /></div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Chi Phí</p>
                    </div>
                    <p className="font-bold text-lg text-orange-600">{totalChiPhi.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{car.chiPhi.length} khoản mục</p>
                </div>
            </div>

            {/* Investors List */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Danh sách góp vốn</span>
                    <Link href={`/cars/${car.id}/investors/new`} className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded-lg transition-colors">
                        + Thêm
                    </Link>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {car.gopVon.map((inv: any) => (
                        <div key={inv.id} className="p-4 flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs mr-3">
                                    {inv.nguoiGop.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{inv.nguoiGop}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{inv.tyLeGop}% cổ phần</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                {inv.daGop.toLocaleString()}
                            </span>
                        </div>
                    ))}
                    {car.gopVon.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-xs italic">Chưa có nhà đầu tư nào.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function RecordsTab({ car, isOverdue }: any) {
    const getDocStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            'CHUA_CAN': 'Chưa Cần',
            'HUA_RUT': 'Hứa Rút',
            'DANG_RUT': 'Đang Rút',
            'DA_RUT': 'Đã Rút',
            'CHUA_CO': 'Chưa Có',
            'QUA_HAN': 'Quá Hạn',
            'DANG_GIU': 'Đang Giữ',
            'DA_GIAO': 'Đã Giao'
        };
        return map[status] || status;
    };

    return (
        <div className="p-4 space-y-4">
            {isOverdue && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-start shadow-sm">
                    <ShieldAlert className="text-red-600 dark:text-red-400 mr-3 shrink-0" size={20} />
                    <div>
                        <h3 className="text-red-800 dark:text-red-300 font-bold text-sm">Hồ sơ quá hạn!</h3>
                        <p className="text-red-600 dark:text-red-400 text-xs mt-1">Cần xử lý ngay để tránh rủi ro.</p>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                     <span className="text-gray-800 dark:text-white text-sm font-bold uppercase flex items-center">
                        <FileText size={16} className="mr-2 text-blue-600"/> Hồ Sơ Pháp Lý
                     </span>
                     <Link href={`/cars/${car.id}/docs`} className="text-blue-600 text-xs font-bold">
                        Chỉnh sửa
                     </Link>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <span className="text-gray-500 text-xs font-bold uppercase">Trạng thái</span>
                        <span className={`font-bold text-xs px-2 py-1 rounded-md ${car.hoSo?.trangThai === 'QUA_HAN' ? 'bg-red-100 text-red-600' : 'bg-white text-gray-800 shadow-sm'}`}>
                            {getDocStatusLabel(car.hoSo?.trangThai || 'CHUA_CO')}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <span className="text-gray-500 text-xs font-bold uppercase">Nơi lưu giữ</span>
                        <span className="text-gray-900 dark:text-white font-bold text-sm">{car.hoSo?.noiGiuHoSo || 'Chưa cập nhật'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-800 dark:text-white text-xs uppercase flex items-center mb-4">
                    <Clock size={16} className="mr-2 text-gray-400"/> Lịch sử hoạt động
                </h3>
                <div className="border-l-2 border-gray-100 dark:border-gray-800 ml-1.5 space-y-6">
                    {car.lichSu.map((log: any) => (
                        <div key={log.id} className="ml-5 relative">
                            <div className="absolute -left-[25px] top-1 w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
                            <p className="text-[10px] text-gray-400 font-mono mb-0.5">
                                {new Date(log.createdAt).toLocaleDateString('vi-VN')} {new Date(log.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <p className="text-sm text-gray-800 dark:text-white font-medium">{log.chiTiet}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Bởi <span className="font-bold">{log.nguoiThucHien}</span></p>
                        </div>
                    ))}
                    {car.lichSu.length === 0 && (
                        <div className="ml-5 text-gray-400 text-xs italic">Chưa có lịch sử.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
