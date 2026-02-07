'use client';

import { useState } from 'react';
import { 
  Badge, Users, DollarSign, FileText, 
  Calendar, MapPin, Activity, 
  CreditCard, Wrench, ShieldAlert, CheckCircle, Clock,
  ArrowRight, Copy, Share2, Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

// NEW: Deal Timeline Component
function DealTimeline({ status, deposit, isSold }: { status: string, deposit: number, isSold: boolean }) {
    const steps = [
        { label: 'Nhập Xe', active: true }, // Always active if car exists
        { label: 'Sẵn Sàng', active: status !== 'TIM_THAY' },
        { label: 'Có Cọc', active: deposit > 0 || isSold },
        { label: 'Đã Bán', active: isSold }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 px-6 pt-6 pb-4 shadow-sm border-b border-gray-50 dark:border-gray-800 mb-2">
             <div className="flex items-center justify-between relative max-w-sm mx-auto">
                {/* Connecting Line - Background */}
                <div className="absolute left-0 top-[14px] w-full h-1.5 bg-gray-100 dark:bg-gray-800 z-0 rounded-full"></div>
                
                {/* Active Line (Dynamic width based on progress) */}
                <div className="absolute left-0 top-[14px] h-1.5 bg-linear-to-r from-blue-500 to-green-500 z-0 rounded-full transition-all duration-1000 ease-out shadow-sm"
                     style={{ 
                         width: isSold ? '100%' : deposit > 0 ? '66%' : status !== 'TIM_THAY' ? '33%' : '0%' 
                     }}
                ></div>

                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center relative z-10 group">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] transition-all duration-500 bg-white dark:bg-gray-900 ${
                            step.active 
                            ? 'border-green-500 shadow-lg shadow-green-100 dark:shadow-green-900/20 scale-110' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}>
                            {step.active ? (
                                <CheckCircle size={16} className="text-green-600 dark:text-green-500 fill-green-100 dark:fill-green-900/30" strokeWidth={2.5} />
                            ) : (
                                <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            )}
                        </div>
                        <span className={`text-[10px] font-bold mt-2 uppercase tracking-wide transition-colors ${
                            step.active ? 'text-green-700 dark:text-green-500' : 'text-gray-300 dark:text-gray-600'
                        }`}>
                            {step.label}
                        </span>
                    </div>
                ))}
             </div>
        </div>
    );
}

export default function CarDetailTabs({ car, totalGop, totalChiPhi, isOverdue }: any) {
  const [activeTab, setActiveTab] = useState('info'); // info, finance, records

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen font-sans">
        {/* Deal Timeline */}
        <DealTimeline status={car.trangThai} deposit={car.soTienCoc} isSold={car.trangThai === 'DA_BAN'} />

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-[57px] z-20 shadow-sm">
            <button 
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3.5 text-sm font-bold border-b-2 transition-all ${activeTab === 'info' ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                Thông tin
            </button>
            <button 
                onClick={() => setActiveTab('finance')}
                className={`flex-1 py-3.5 text-sm font-bold border-b-2 transition-all ${activeTab === 'finance' ? 'border-green-600 text-green-600 bg-green-50/50 dark:bg-green-900/20' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                Tài chính
            </button>
            <button 
                onClick={() => setActiveTab('records')}
                className={`flex-1 py-3.5 text-sm font-bold border-b-2 transition-all ${activeTab === 'records' ? 'border-purple-600 text-purple-600 bg-purple-50/50 dark:bg-purple-900/20' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                Hồ sơ
            </button>
        </div>

        <div className="pb-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'info' && <InfoTab car={car} isOverdue={isOverdue} />}
            {activeTab === 'finance' && <FinanceTab car={car} totalGop={totalGop} totalChiPhi={totalChiPhi} />}
            {activeTab === 'records' && <RecordsTab car={car} isOverdue={isOverdue} />}
        </div>
    </div>
  );
}

function InfoTab({ car, isOverdue }: any) {
    const handleCopy = () => {
        const text = `🚘 Bán xe: ${car.dongXe}\n📅 Đời: ${car.namSanXuat}\n🎨 Màu: ${car.mauXe}\n💰 Giá: ...\n📍 Xem xe tại: ${car.tinhThanh}`;
        navigator.clipboard.writeText(text);
        toast.success('Đã sao chép nội dung!', { description: 'Sẵn sàng dán vào Zalo/Facebook' });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Bán xe ${car.dongXe}`,
                    text: `Cần bán ${car.dongXe} đời ${car.namSanXuat}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-900 p-6 pb-12 rounded-b-[2.5rem] shadow-sm border-b border-gray-100 dark:border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-transparent z-0"></div>
                
                {/* Image Slideshow (Full Width if available) */}
                {car.hinhAnh && car.hinhAnh !== "[]" ? (
                     <div className="relative w-full h-64 -mx-6 -mt-6 mb-6">
                         {(() => {
                             try {
                                 const images = JSON.parse(car.hinhAnh);
                                 return (
                                     <div className="flex overflow-x-auto snap-x snap-mandatory h-full no-scrollbar">
                                         {images.map((img: string, idx: number) => (
                                             <div key={idx} className="relative w-full shrink-0 snap-center">
                                                 <Image src={img} fill className="object-cover" alt={`Car ${idx}`} />
                                                 <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-md">
                                                     {idx + 1}/{images.length}
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 );
                             } catch (e) { return null; }
                         })()}
                     </div>
                ) : null}

                <div className="relative z-10 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">{car.dongXe}</h2>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-gray-200 dark:border-gray-700">
                            {car.bienSo || 'Chưa có biển'}
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                        <span>{car.mauXe}</span>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                        <span>{car.namSanXuat}</span>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                        <span>{car.tinhThanh}</span>
                    </div>
                    
                    {/* One-Tap Actions */}
                    <div className="flex justify-center gap-3 mt-6">
                        <button 
                            onClick={handleCopy}
                            className="flex items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                        >
                            <Copy size={16} className="mr-2"/> Sao Chép
                        </button>
                        <button 
                            onClick={handleShare}
                            className="flex items-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                        >
                            <Share2 size={16} className="mr-2"/> Chia Sẻ
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="px-4 -mt-8 relative z-10 mb-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none p-3 grid grid-cols-4 gap-2 border border-gray-100 dark:border-gray-800">
                    <Link href={`/cars/${car.id}/docs`} className="flex flex-col items-center py-2 text-gray-600 dark:text-gray-400 active:bg-gray-50 dark:active:bg-gray-800 rounded-xl transition-colors">
                        <div className={`p-2 rounded-full mb-1 ${isOverdue ? 'bg-red-50 text-red-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400'}`}>
                            <FileText size={20} />
                        </div>
                        <span className={`text-[10px] font-bold ${isOverdue ? 'text-red-500' : ''}`}>Hồ Sơ</span>
                    </Link>
                    <Link href={`/cars/${car.id}/investors/new`} className="flex flex-col items-center py-2 text-gray-600 dark:text-gray-400 active:bg-gray-50 dark:active:bg-gray-800 rounded-xl transition-colors">
                        <div className="p-2 rounded-full mb-1 bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400">
                            <Users size={20} />
                        </div>
                        <span className="text-[10px] font-bold">Góp Vốn</span>
                    </Link>
                    <Link href={`/cars/${car.id}/expenses`} className="flex flex-col items-center py-2 text-gray-600 dark:text-gray-400 active:bg-gray-50 dark:active:bg-gray-800 rounded-xl transition-colors">
                         <div className="p-2 rounded-full mb-1 bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400">
                            <Wrench size={20} />
                        </div>
                        <span className="text-[10px] font-bold">Chi Phí</span>
                    </Link>
                    <Link href={`/cars/${car.id}/sell`} className={`flex flex-col items-center py-2 active:bg-gray-50 dark:active:bg-gray-800 rounded-xl transition-colors ${car.trangThai === 'DA_BAN' ? 'opacity-100 pointer-events-none' : ''}`}>
                         <div className={`p-2 rounded-full mb-1 ${car.trangThai === 'DA_BAN' ? 'bg-green-50 text-green-500' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-500 dark:text-purple-400'}`}>
                            {car.trangThai === 'DA_BAN' ? <CheckCircle size={20} /> : <DollarSign size={20} />}
                        </div>
                        <span className={`text-[10px] font-bold ${car.trangThai === 'DA_BAN' ? 'text-green-600' : ''}`}>{car.trangThai === 'DA_BAN' ? 'Đã Bán' : 'Bán Xe'}</span>
                    </Link>
                </div>
            </div>

            {/* Key Stats Grid */}
            <div className="px-4 grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Giá Nhập</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{car.tongGiaMua.toLocaleString()} <span className="text-xs font-normal text-gray-400">đ</span></p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Đã Cọc</p>
                    <p className={`text-lg font-bold ${car.soTienCoc > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        {car.soTienCoc > 0 ? car.soTienCoc.toLocaleString() : '0'} <span className="text-xs font-normal text-gray-400">đ</span>
                    </p>
                </div>
            </div>

            {/* General Info List */}
            <div className="px-4">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-sm uppercase flex items-center px-1">
                    Thông tin chi tiết
                </h3>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-0 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden divide-y divide-gray-50 dark:divide-gray-800">
                    <div className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Activity size={16} className="mr-3 text-blue-500"/>
                            <span className="text-sm font-medium">Trạng thái</span>
                        </div>
                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">
                            {car.trangThai.replace(/_/g, ' ')}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Users size={16} className="mr-3 text-purple-500"/>
                            <span className="text-sm font-medium">Người bán</span>
                        </div>
                        <div className="text-right">
                             <span className="text-gray-900 dark:text-white font-bold text-sm block">{car.nguoiBan}</span>
                             {car.sdtNguoiBan && <span className="text-blue-500 text-xs font-bold">{car.sdtNguoiBan}</span>}
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Calendar size={16} className="mr-3 text-orange-500"/>
                            <span className="text-sm font-medium">Ngày nhập kho</span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-bold text-sm">{new Date(car.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>

                     <div className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Share2 size={16} className="mr-3 text-blue-400"/>
                            <span className="text-sm font-medium">Nguồn tin</span>
                        </div>
                        {car.facebookLink ? (
                            <a href={car.facebookLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline flex items-center">
                                Xem bài đăng <ArrowRight size={12} className="ml-1"/>
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

function FinanceTab({ car, totalGop, totalChiPhi }: any) {
    return (
        <div className="p-4 space-y-6">
             {/* Finance Hero */}
             <div className="bg-black text-white p-6 rounded-3xl shadow-xl shadow-gray-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Tổng Giá Mua</p>
                            <h2 className="text-3xl font-bold tracking-tight">{car.tongGiaMua.toLocaleString()} <span className="text-sm font-normal text-gray-500">đ</span></h2>
                        </div>
                        <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md">
                            <DollarSign size={20} className="text-green-400" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                        <div>
                             <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Đã Cọc</p>
                             <p className="font-bold text-lg">{car.soTienCoc.toLocaleString()}</p>
                        </div>
                         <div>
                             <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Đã Chuyển</p>
                             <p className="font-bold text-lg">{car.soTienDaChuyen.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
             </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-2">Vốn Góp</p>
                        <p className="font-bold text-xl text-gray-900 dark:text-white">{totalGop.toLocaleString()}</p>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min((totalGop / car.tongGiaMua) * 100, 100)}%` }}></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-2">Chi Phí</p>
                        <p className="font-bold text-xl text-orange-600">{totalChiPhi.toLocaleString()}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mt-1 bg-gray-50 dark:bg-gray-800 inline-block px-2 py-0.5 rounded-lg self-start">
                        {car.chiPhi.length} khoản mục
                    </p>
                </div>
            </div>

            {/* Investors */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nhà đầu tư ({car.gopVon.length})</span>
                    <Link href={`/cars/${car.id}/investors/new`} className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded-lg transition-colors">
                        + Thêm mới
                    </Link>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {car.gopVon.map((inv: any) => (
                        <div key={inv.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs mr-3">
                                    {inv.nguoiGop.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{inv.nguoiGop}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tỷ lệ: {inv.tyLeGop}%</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                                {inv.daGop.toLocaleString()}
                            </span>
                        </div>
                    ))}
                    {car.gopVon.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">Chưa có nhà đầu tư nào.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function RecordsTab({ car, isOverdue }: any) {
    return (
        <div className="p-4 space-y-6">
            {isOverdue && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-start shadow-sm animate-pulse">
                    <ShieldAlert className="text-red-600 dark:text-red-400 mr-3 shrink-0" size={24} />
                    <div>
                        <h3 className="text-red-800 dark:text-red-300 font-bold text-sm">Hồ sơ quá hạn xử lý!</h3>
                        <p className="text-red-600 dark:text-red-400 text-xs mt-1 leading-relaxed">Vui lòng cập nhật trạng thái hồ sơ hoặc gia hạn ngay để tránh rủi ro pháp lý.</p>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50 dark:border-gray-800">
                     <span className="text-gray-800 dark:text-white text-sm font-bold uppercase flex items-center">
                        <FileText size={18} className="mr-2 text-blue-600 dark:text-blue-400"/> Trạng thái hồ sơ
                     </span>
                     <Link href={`/cars/${car.id}/docs`} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        Cập nhật
                     </Link>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Hiện trạng</span>
                        <span className={`font-bold text-sm px-2 py-1 rounded-lg ${car.hoSo?.trangThai === 'QUA_HAN' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'}`}>
                            {car.hoSo?.trangThai || 'CHUA_CO'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Nơi lưu giữ</span>
                        <span className="text-gray-900 dark:text-white font-medium text-sm">{car.hoSo?.noiGiuHoSo || 'Chưa cập nhật'}</span>
                    </div>
                </div>
            </div>

            <div className="pl-2">
                <h3 className="font-bold text-gray-800 dark:text-white text-sm uppercase flex items-center mb-4 pl-2">
                    <Clock size={16} className="mr-2 text-gray-400"/> Lịch sử hoạt động
                </h3>
                <div className="border-l-2 border-gray-100 dark:border-gray-800 ml-2 space-y-6 pb-4">
                    {car.lichSu.map((log: any) => (
                        <div key={log.id} className="ml-6 relative group">
                            <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-white dark:bg-gray-900 rounded-full border-2 border-gray-300 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 group-hover:scale-110 transition-all"></div>
                            <p className="text-[10px] text-gray-400 font-mono mb-0.5">
                                {new Date(log.createdAt).toLocaleDateString('vi-VN')} • {new Date(log.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <p className="text-sm text-gray-800 dark:text-white font-medium">{log.chiTiet}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Thực hiện bởi <span className="font-bold">{log.nguoiThucHien}</span></p>
                        </div>
                    ))}
                    {car.lichSu.length === 0 && (
                        <div className="ml-6 text-gray-400 text-xs italic">Chưa có lịch sử hoạt động</div>
                    )}
                </div>
            </div>
        </div>
    );
}
