'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Phone, Link as LinkIcon, MapPin, 
    CreditCard, Calendar, FileText, CheckCircle,
    ChevronDown, ChevronUp, ArrowLeft
} from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import CurrencyInput from '@/components/ui/CurrencyInput';
import { MOTORBIKE_MODELS } from '@/lib/constants';
import { carSchema, type CarFormData } from '@/lib/schemas';

interface CarFormProps {
    defaultValues?: Partial<CarFormData>;
    onSubmit: (data: CarFormData) => Promise<void>;
    loading?: boolean;
    mode: 'create' | 'edit';
    onValuesChange?: (data: CarFormData) => void;
}

export default function CarForm({ defaultValues, onSubmit, loading, mode, onValuesChange }: CarFormProps) {
    const [activeStep, setActiveStep] = useState(1);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [dealStatus, setDealStatus] = useState<'PENDING' | 'DEPOSITED' | 'BOUGHT_NOW'>('PENDING');

    const form = useForm<CarFormData>({
        resolver: zodResolver(carSchema) as any,
        defaultValues: {
            tinhTrang: 95,
            namSanXuat: new Date().getFullYear(),
            tongGiaMua: 0,
            soTienCoc: 0,
            hinhAnh: [],
            nguonGoc: 'MUA_DAN',
            ...defaultValues
        }
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = form;
    const formData = watch();

    // Reset form when defaultValues change (important for draft restore)
    useEffect(() => {
        if (defaultValues) {
            reset({
                tinhTrang: 95,
                namSanXuat: new Date().getFullYear(),
                tongGiaMua: 0,
                soTienCoc: 0,
                hinhAnh: [],
                nguonGoc: 'MUA_DAN',
                ...defaultValues
            });
            // Update local dealStatus state based on new values
            if (defaultValues.soTienCoc && defaultValues.soTienCoc > 0) setDealStatus('DEPOSITED');
            else if (defaultValues.trangThai === 'DA_COC') setDealStatus('DEPOSITED'); // Fallback
            else setDealStatus('PENDING');
        }
    }, [defaultValues, reset]);

    // Notify parent of changes
    useEffect(() => {
        if (onValuesChange) {
            const subscription = watch((value) => {
                onValuesChange(value as CarFormData);
            });
            return () => subscription.unsubscribe();
        }
    }, [watch, onValuesChange]);

    const handleStepSubmit = async () => {
        if (activeStep === 1) {
            const result = await form.trigger(['dongXe', 'namSanXuat', 'mauXe', 'hinhAnh']);
            if (!result) return;
        }
        setActiveStep(prev => prev + 1);
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode='wait'>
                {/* Step 1: Thông tin xe */}
                {activeStep === 1 && (
                    <motion.div
                        key="step1"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                             <div className="w-16 h-16 bg-violet-50 dark:bg-violet-900/20 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white dark:border-slate-800 shadow-lg shadow-violet-100 dark:shadow-none">
                                <User size={28} className="text-violet-600 dark:text-violet-400" strokeWidth={2} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Thông Tin Xe</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Nhập thông tin cơ bản về xe</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/50 space-y-5">
                            
                            {/* Image Upload */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className={`text-xs font-bold uppercase ${errors.hinhAnh ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                        Hình Ảnh Xe {errors.hinhAnh && '(Bắt buộc)'}
                                    </label>
                                </div>
                                <ImageUpload 
                                    value={formData.hinhAnh || []}
                                    onChange={(urls) => {
                                        setValue('hinhAnh', urls);
                                        if (urls.length > 0) form.clearErrors('hinhAnh');
                                    }}
                                    onRemove={(url) => setValue('hinhAnh', (formData.hinhAnh || []).filter(x => x !== url))}
                                />
                                {errors.hinhAnh && <p className="text-xs text-red-500 mt-1">{errors.hinhAnh.message}</p>}
                            </div>

                            {/* Quick Select Model */}
                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block">Chọn nhanh mẫu xe</label>
                             {Object.entries(MOTORBIKE_MODELS).map(([category, models]) => (
                                <div key={category} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                                    <button 
                                        type="button"
                                        onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                                        className="w-full flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">{category}</span>
                                        {expandedCategory === category ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {expandedCategory === category && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-3 bg-white dark:bg-slate-900 flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800">
                                                    {models.map(model => (
                                                        <button 
                                                            key={model}
                                                            type="button"
                                                            onClick={() => setValue('dongXe', model)}
                                                            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 rounded-lg text-[11px] font-bold border border-slate-100 dark:border-slate-700 transition-colors active:scale-95"
                                                        >
                                                            {model}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                             ))}

                            {/* Main Info Inputs */}
                            <div>
                                <label className="text-xs font-bold uppercase block mb-1.5 text-slate-500 dark:text-slate-400">Dòng Xe</label>
                                <Input
                                    {...register('dongXe')}
                                    className={`h-14 text-lg font-bold bg-white dark:bg-slate-950 ${errors.dongXe ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                                    placeholder="Vd: Honda SH 150i 2023..."
                                />
                                {errors.dongXe && <p className="text-xs text-red-500 mt-1">{errors.dongXe.message}</p>}
                            </div>

                            {/* Condition Slider */}
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tình Trạng Xe</label>
                                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                                        (formData.tinhTrang || 90) >= 90 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 
                                        (formData.tinhTrang || 90) >= 70 ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' : 
                                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                    }`}>
                                        {formData.tinhTrang || 90}%
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="10" 
                                    max="100" 
                                    step="5"
                                    {...register('tinhTrang')}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1">
                                    <span>Nát</span>
                                    <span>Trung bình</span>
                                    <span>Lướt</span>
                                    <span>Mới tinh</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1.5 text-slate-500 dark:text-slate-400">Đời Xe</label>
                                    <Input
                                        type="number"
                                        {...register('namSanXuat')}
                                        className="text-center font-bold bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1.5 text-slate-500 dark:text-slate-400">Màu Sắc</label>
                                    <Input
                                        {...register('mauXe')}
                                        className="text-center font-medium bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700"
                                        placeholder="Trắng"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1.5 text-slate-500 dark:text-slate-400">Số Khung</label>
                                    <Input
                                        {...register('soKhung')}
                                        className="text-center font-mono text-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700"
                                        placeholder="----"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1.5 text-slate-500 dark:text-slate-400">Số Máy</label>
                                    <Input
                                        {...register('soMay')}
                                        className="text-center font-mono text-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700"
                                        placeholder="----"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1.5">Biển Số</label>
                                <Input
                                    {...register('bienSo')}
                                    className="font-mono uppercase tracking-widest text-center border-dashed bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700"
                                    placeholder="30K-XXXXX"
                                />
                            </div>

                            {/* Additional Info */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">Nguồn Gốc Xe</label>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {[
                                        { id: 'MUA_DAN', label: 'Mua Dân' },
                                        { id: 'MUA_LAI', label: 'Mua Lại / Thợ' },
                                        { id: 'MUA_FB', label: 'Mua Facebook' },
                                        { id: 'KHAC', label: 'Khác' }
                                    ].map(source => (
                                        <button
                                            key={source.id}
                                            type="button"
                                            onClick={() => setValue('nguonGoc', source.id)}
                                            className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                                                formData.nguonGoc === source.id
                                                ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400'
                                                : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            {source.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1.5">Người Bán</label>
                                        <div className="relative group">
                                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"/>
                                            <Input {...register('nguoiBan')} className="pl-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700" placeholder="Tên chủ xe" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1.5">SĐT Liên Hệ</label>
                                        <div className="relative group">
                                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"/>
                                            <Input {...register('soDienThoai')} className="pl-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700" placeholder="09..." />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4 mt-4">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1.5">Khu Vực</label>
                                    <div className="relative group">
                                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"/>
                                        <Input {...register('tinhThanh')} className="pl-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700" placeholder="Hà Nội" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1.5">Link Facebook</label>
                                    <div className="relative group">
                                        <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"/>
                                        <Input {...register('facebookLink')} className="pl-10 text-violet-600 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700" placeholder="https://facebook.com/..." />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="button"
                            onClick={handleStepSubmit}
                            className="w-full h-12 text-base bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/30"
                        >
                            Tiếp Theo
                        </Button>
                    </motion.div>
                )}

                {/* Step 2: Tài chính */}
                {activeStep === 2 && (
                    <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white dark:border-gray-800 shadow-lg shadow-green-100 dark:shadow-none">
                                <CreditCard size={28} className="text-green-600 dark:text-green-400" strokeWidth={2} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Tài Chính</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Thông tin giá và thanh toán</p>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                            
                            {/* Deal Status Toggle */}
                            <div className="grid grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDealStatus('PENDING');
                                        setValue('trangThai', 'TIM_THAY');
                                    }}
                                    className={`py-3 rounded-xl text-[13px] font-bold transition-all ${
                                        dealStatus === 'PENDING' 
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                    }`}
                                >
                                    Chưa Cọc
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDealStatus('DEPOSITED');
                                        setValue('trangThai', 'DA_COC');
                                    }}
                                    className={`py-3 rounded-xl text-[13px] font-bold transition-all ${
                                        dealStatus === 'DEPOSITED' 
                                        ? 'bg-white dark:bg-gray-700 text-yellow-600 dark:text-yellow-400 shadow-sm' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                    }`}
                                >
                                    Đã Cọc
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDealStatus('BOUGHT_NOW');
                                        setValue('trangThai', 'DA_COC'); // Or specific status
                                    }}
                                    className={`py-3 rounded-xl text-[13px] font-bold transition-all ${
                                        dealStatus === 'BOUGHT_NOW' 
                                        ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                    }`}
                                >
                                    Mua Luôn
                                </button>
                            </div>

                            <AnimatePresence mode='wait'>
                                {dealStatus !== 'PENDING' ? (
                                    <motion.div
                                        key="active-deal"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Giá Mua Chốt</label>
                                            <CurrencyInput
                                                value={formData.tongGiaMua}
                                                onChange={(val) => setValue('tongGiaMua', val)}
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-2xl font-bold text-gray-800 dark:text-white"
                                            />
                                        </div>

                                        {dealStatus === 'DEPOSITED' && (
                                            <div className="bg-yellow-50/50 dark:bg-yellow-900/10 p-5 rounded-2xl border border-yellow-100 dark:border-yellow-900/20">
                                                <label className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase block mb-2">Số Tiền Cọc</label>
                                                <CurrencyInput
                                                    value={formData.soTienCoc}
                                                    onChange={(val) => setValue('soTienCoc', val)}
                                                    className="w-full bg-white dark:bg-gray-900 border-2 border-yellow-100 dark:border-yellow-900/30 rounded-xl p-3 text-xl font-bold text-red-500 dark:text-red-400"
                                                />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Tài Khoản Giữ Tiền</label>
                                                <Input {...register('nguoiGiuTien')} placeholder="Vd: Techcombank - Nguyen Van A" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Ngày Hẹn Giao Xe</label>
                                                <div className="relative group">
                                                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"/>
                                                    <Input type="date" {...register('ngayHenGiao')} className="pl-10" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="pending"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700"
                                    >
                                        <p className="text-sm mb-2">Bạn đang lưu xe ở trạng thái <strong>Tìm Thấy / Tham Khảo</strong>.</p>
                                        <p className="text-xs opacity-70">Chưa cần nhập giá và tiền cọc lúc này.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" variant="secondary" onClick={() => setActiveStep(1)} className="flex-1 h-12">Quay Lại</Button>
                            <Button 
                                type="button"
                                onClick={() => setActiveStep(3)}
                                className="flex-2 h-12"
                            >
                                Tiếp Theo
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Hồ Sơ */}
                {activeStep === 3 && (
                    <motion.div
                        key="step3"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                         <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white dark:border-gray-800 shadow-lg shadow-orange-100 dark:shadow-none">
                                <FileText size={28} className="text-orange-600 dark:text-orange-400" strokeWidth={2} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Hồ Sơ & Pháp Lý</h2>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Trạng Thái Hồ Sơ</label>
                                <select {...register('hoSo_trangThai')} className="w-full bg-gray-50 dark:bg-gray-800 border rounded-xl p-3 font-bold h-10 text-sm">
                                    <option value="CHUA_CAN">Chưa cần rút</option>
                                    <option value="HUA_RUT">Chủ cũ hứa rút</option>
                                    <option value="DANG_RUT">Đang làm thủ tục rút</option>
                                    <option value="DA_RUT">Đã rút (Cầm hồ sơ gốc)</option>
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Ngày Hẹn</label>
                                    <Input type="date" {...register('hoSo_ngayHen')} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Người Phụ Trách</label>
                                    <Input {...register('hoSo_nguoiPhuTrach')} placeholder="Tên..." />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" variant="secondary" onClick={() => setActiveStep(2)} className="flex-1 h-12">Quay Lại</Button>
                            <Button 
                                type="submit"
                                disabled={loading}
                                className="flex-2 h-12 bg-green-600 hover:bg-green-700"
                            >
                                {loading ? 'Đang Lưu...' : (mode === 'create' ? 'Tạo Mới Xe' : 'Lưu Thay Đổi')}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
}
