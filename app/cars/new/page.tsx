'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronDown, 
    ChevronUp, 
    User, 
    Phone, 
    Link as LinkIcon, 
    MapPin, 
    CreditCard, 
    Calendar, 
    FileText, 
    CheckCircle 
} from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import CurrencyInput from '@/components/ui/CurrencyInput';
import { MOTORBIKE_MODELS } from '@/lib/constants';

export default function NewCarPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [showOriginInfo, setShowOriginInfo] = useState(false);
    const [dealStatus, setDealStatus] = useState<'PENDING' | 'DEPOSITED' | 'BOUGHT_NOW'>('PENDING');
    
    // Prompt states
    const [showDocsPrompt, setShowDocsPrompt] = useState(false);
    const [showDraftPrompt, setShowDraftPrompt] = useState(false);
    const [pendingDraftData, setPendingDraftData] = useState<any>(null);

    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const [formData, setFormData] = useState({
        hinhAnh: [] as string[],
        dongXe: '',
        tinhTrang: 95,
        namSanXuat: new Date().getFullYear(),
        mauXe: '',
        bienSo: '',
        nguonGoc: 'MUA_DAN',
        nguoiBan: '',
        soDienThoai: '',
        facebookLink: '',
        tinhThanh: '',
        tongGiaMua: 0,
        soTienCoc: 0,
        nguoiGiuTien: '',
        ngayHenGiao: '',
        hoSo_trangThai: 'CHUA_CAN',
        hoSo_noiGiu: 'CHU_CU',
        hoSo_ngayHen: '',
        hoSo_nguoiPhuTrach: ''
    });

    useEffect(() => {
        // Check for draft
        const draft = localStorage.getItem('car_draft');
        if (draft) {
            try {
                const data = JSON.parse(draft);
                setPendingDraftData(data);
                setShowDraftPrompt(true);
            } catch (e) {
                console.error("Failed to parse draft", e);
            }
        }
    }, []);

    useEffect(() => {
        // Save draft
        if (formData.dongXe) {
            localStorage.setItem('car_draft', JSON.stringify(formData));
        }
    }, [formData]);

    const setBrand = (model: string) => {
        setFormData(prev => ({ ...prev, dongXe: model }));
        setExpandedCategory(null);
    };

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         setFormData(prev => ({ ...prev, facebookLink: e.target.value }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const nextStep = () => {
        // Validate step 1
        if (activeStep === 1) {
            const newErrors: Record<string, boolean> = {};
            if (!formData.dongXe) newErrors.dongXe = true;
            if (!formData.namSanXuat) newErrors.namSanXuat = true;
            if (!formData.mauXe) newErrors.mauXe = true;
            
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
        }
        setActiveStep(prev => prev + 1);
    };

    const prevStep = () => setActiveStep(prev => prev - 1);

    const handleSaveCar = async () => {
        setLoading(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Clear draft
            localStorage.removeItem('car_draft');
            
            setLoading(false);
            setShowDocsPrompt(true);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleUpdateDocs = async () => {
        setLoading(true);
        try {
            // Mock API call for docs update
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
            router.push('/cars');
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleRestoreDraft = () => {
        if (pendingDraftData) {
            setFormData(pendingDraftData);
            setShowDraftPrompt(false);
        }
    };

    const handleDiscardDraft = () => {
        setShowDraftPrompt(false);
        localStorage.removeItem('car_draft');
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-24 block">
      <form onSubmit={(e) => e.preventDefault()} className="p-5 max-w-lg mx-auto">
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
                         <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white dark:border-gray-800 shadow-lg shadow-blue-100 dark:shadow-none">
                            <User size={28} className="text-blue-600 dark:text-blue-400" strokeWidth={2} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Thông Tin Xe</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nhập thông tin cơ bản về xe</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
                        
                        {/* Image Upload Component */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-3">Hình Ảnh Xe</label>
                            <ImageUpload 
                                value={formData.hinhAnh}
                                onChange={(urls) => setFormData(prev => ({ ...prev, hinhAnh: urls }))}
                                onRemove={(url) => setFormData(prev => ({ ...prev, hinhAnh: prev.hinhAnh.filter(x => x !== url) }))}
                            />
                        </div>

                             <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase block">Chọn nhanh mẫu xe</label>
                             
                             {Object.entries(MOTORBIKE_MODELS).map(([category, models]) => (
                                <div key={category} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                                    <button 
                                        type="button"
                                        onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                                        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{category}</span>
                                        {expandedCategory === category ? 
                                            <ChevronUp size={16} className="text-gray-400" /> : 
                                            <ChevronDown size={16} className="text-gray-400" />
                                        }
                                    </button>
                                    
                                    <AnimatePresence>
                                        {expandedCategory === category && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-3 bg-white dark:bg-gray-900 flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-800">
                                                    {models.map(model => (
                                                        <button 
                                                            key={model}
                                                            type="button"
                                                            onClick={() => setBrand(model)}
                                                            className="px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-[11px] font-bold border border-gray-100 dark:border-gray-700 transition-colors active:scale-95"
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
                        

                        <div>
                            <label className={`text-xs font-bold uppercase block mb-1.5 ${errors.dongXe ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>Dòng Xe (Tên đầy đủ)</label>
                            <motion.div animate={errors.dongXe ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
                                <input
                                    type="text"
                                    name="dongXe"
                                    required
                                    autoFocus
                                    value={formData.dongXe}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-2xl p-4 text-lg font-bold text-gray-800 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-4 transition-all placeholder:font-normal ${
                                        errors.dongXe 
                                        ? 'border-red-500 focus:ring-red-100 dark:focus:ring-red-900/20 focus:border-red-500' 
                                        : 'border-gray-200 dark:border-gray-700 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-300 dark:focus:border-blue-700'
                                    }`}
                                    placeholder="Vd: Honda SH 150i 2023..."
                                />
                            </motion.div>
                        </div>

                        {/* NEW: Condition Slider */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                             <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Tình Trạng Xe</label>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                                    formData.tinhTrang >= 90 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 
                                    formData.tinhTrang >= 70 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 
                                    formData.tinhTrang >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                    {formData.tinhTrang}% • {
                                        formData.tinhTrang >= 99 ? 'Mới cứng' : 
                                        formData.tinhTrang >= 90 ? 'Siêu lướt' : 
                                        formData.tinhTrang >= 70 ? 'Lướt đẹp' : 
                                        formData.tinhTrang >= 50 ? 'Trung bình' : 'Xe cũ nát'
                                    }
                                </span>
                             </div>
                             <input 
                                type="range" 
                                min="10" 
                                max="100" 
                                step="5"
                                name="tinhTrang"
                                value={formData.tinhTrang}
                                onChange={(e) => setFormData(prev => ({ ...prev, tinhTrang: Number(e.target.value) }))}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                             <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 font-bold mt-1">
                                 <span>Nát</span>
                                 <span>Trung bình</span>
                                 <span>Lướt</span>
                                 <span>Mới tinh</span>
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`text-xs font-bold uppercase block mb-1.5 ${errors.namSanXuat ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>Đời Xe (Năm)</label>
                                <motion.div animate={errors.namSanXuat ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
                                    <input
                                        type="number"
                                        name="namSanXuat"
                                        required
                                        value={formData.namSanXuat}
                                        onChange={handleChange}
                                        className={`input-primary text-center font-bold ${errors.namSanXuat ? 'border-red-500 ring-red-100' : ''}`}
                                    />
                                </motion.div>
                            </div>
                            <div>
                                <label className={`text-xs font-bold uppercase block mb-1.5 ${errors.mauXe ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>Màu Sắc</label>
                                <motion.div animate={errors.mauXe ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
                                    <input
                                        type="text"
                                        name="mauXe"
                                        required
                                        value={formData.mauXe}
                                        onChange={handleChange}
                                        className={`input-primary text-center font-medium ${errors.mauXe ? 'border-red-500 ring-red-100' : ''}`}
                                        placeholder="Trắng"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Biển Số (Nếu có)</label>
                            <input
                                type="text"
                                name="bienSo"
                                value={formData.bienSo}
                                onChange={handleChange}
                                className="input-primary font-mono uppercase tracking-widest text-center border-dashed"
                                placeholder="30K-XXXXX"
                            />
                        </div>

                        {/* Merged Fields from old Step 1 */}
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowOriginInfo(!showOriginInfo)}
                                className="w-full flex items-center justify-between text-left group"
                            >
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center">
                                        <User size={18} className="mr-2 text-blue-500" />
                                        Nguồn Gốc Mua
                                    </h3>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 ml-6.5">
                                        Thông tin chủ xe, nơi mua (Không bắt buộc nhập ngay)
                                    </p>
                                </div>
                                <div className={`p-2 rounded-full bg-gray-50 dark:bg-gray-800 transition-transform duration-200 ${showOriginInfo ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={18} className="text-gray-500" />
                                </div>
                            </button>
                            
                            <AnimatePresence>
                                {showOriginInfo && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 space-y-4">
                                            {/* Nguồn Gốc */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-2">Nguồn Gốc Xe</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { id: 'MUA_DAN', label: 'Mua Dân' },
                                                        { id: 'MUA_LAI', label: 'Mua Lại / Thợ' },
                                                        { id: 'MUA_FB', label: 'Mua Facebook' },
                                                        { id: 'KHAC', label: 'Khác' }
                                                    ].map(source => (
                                                        <button
                                                            key={source.id}
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, nguonGoc: source.id }))}
                                                            className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                                                                formData.nguonGoc === source.id
                                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
                                                                : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                            }`}
                                                        >
                                                            {source.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Người Bán</label>
                                                    <div className="relative group">
                                                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors"/>
                                                        <input
                                                            type="text"
                                                            name="nguoiBan"
                                                            value={formData.nguoiBan}
                                                            onChange={handleChange}
                                                            className="input-primary pl-11!"
                                                            placeholder="Tên chủ xe"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">SĐT Liên Hệ</label>
                                                    <div className="relative group">
                                                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors"/>
                                                        <input
                                                            type="tel"
                                                            name="soDienThoai"
                                                            value={formData.soDienThoai}
                                                            onChange={handleChange}
                                                            className="input-primary pl-11!"
                                                            placeholder="0912..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Conditional Link Input if Source is Facebook */}
                                            <AnimatePresence>
                                                {formData.nguonGoc === 'MUA_FB' && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Link Bài Mua / Facebook Người Bán</label>
                                                        <div className="relative group">
                                                            <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors"/>
                                                            <input
                                                                type="url"
                                                                name="facebookLink"
                                                                value={formData.facebookLink}
                                                                onChange={handleLinkChange}
                                                                className="input-primary pl-11! text-blue-600 dark:text-blue-400"
                                                                placeholder="https://facebook.com/..."
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div>
                                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Khu Vực</label>
                                                <div className="relative group">
                                                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors"/>
                                                    <input
                                                        type="text"
                                                        name="tinhThanh"
                                                        value={formData.tinhThanh}
                                                        onChange={handleChange}
                                                        className="input-primary pl-11!"
                                                        placeholder="Hà Nội"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            type="button"
                            onClick={() => router.push('/cars')}
                            className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 p-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
                        >
                            Hủy
                        </button>
                        <button 
                            type="button"
                            onClick={nextStep}
                            className="flex-2 btn-primary bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-indigo-600"
                        >
                            Tiếp Theo
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Step 2: Tài chính (Was Step 3) */}
            {activeStep === 2 && (
                <motion.div 
                    key="step3"
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
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Trạng Thái Giao Dịch</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Xác nhận tình trạng mua bán</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                        
                        {/* Toggle Deal Status */}
                        <div className="grid grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl gap-1">
                            <button
                                type="button"
                                onClick={() => setDealStatus('PENDING')}
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
                                onClick={() => setDealStatus('DEPOSITED')}
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
                                onClick={() => setDealStatus('BOUGHT_NOW')}
                                className={`py-3 rounded-xl text-[13px] font-bold transition-all ${
                                    dealStatus === 'BOUGHT_NOW' 
                                    ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                }`}
                            >
                                Mua Luôn
                            </button>
                        </div>

                        {/* Conditional Inputs */}
                        <AnimatePresence mode='wait'>
                            {(dealStatus === 'DEPOSITED' || dealStatus === 'BOUGHT_NOW') ? (
                                <motion.div 
                                    key="active-deal"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Giá Mua Chốt (VNĐ)</label>
                                        <div className="relative group">
                                            <CurrencyInput
                                                required
                                                autoFocus
                                                value={formData.tongGiaMua}
                                                onChange={(val) => setFormData(prev => ({ ...prev, tongGiaMua: val }))}
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 pr-12 text-2xl font-bold text-gray-800 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/20 focus:border-green-300 dark:focus:border-green-700 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {dealStatus === 'DEPOSITED' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="bg-yellow-50/50 dark:bg-yellow-900/10 p-5 rounded-2xl border border-yellow-100 dark:border-yellow-900/20 transition-all hover:shadow-md hover:border-yellow-200 dark:hover:border-yellow-900/30 group"
                                        >
                                            <label className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase mb-2 flex items-center">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                                                Số Tiền Cọc Ngay
                                            </label>
                                            <div className="relative">
                                                <CurrencyInput
                                                    required
                                                    value={formData.soTienCoc}
                                                    onChange={(val) => setFormData(prev => ({ ...prev, soTienCoc: val }))}
                                                    className="w-full bg-white dark:bg-gray-900 border-2 border-yellow-100 dark:border-yellow-900/30 rounded-xl p-3 pr-10 text-xl font-bold text-red-500 dark:text-red-400 outline-none focus:border-yellow-400 dark:focus:border-yellow-600 focus:ring-4 focus:ring-yellow-100 dark:focus:ring-yellow-900/20 transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Tài Khoản Giữ Tiền</label>
                                            <input
                                                type="text"
                                                name="nguoiGiuTien"
                                                value={formData.nguoiGiuTien}
                                                onChange={handleChange}
                                                className="input-primary"
                                                placeholder="Vd: Techcombank - Nguyen Van A"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Ngày Hẹn Giao Xe</label>
                                            <div className="relative group">
                                                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors"/>
                                                <input
                                                    type="date"
                                                    name="ngayHenGiao"
                                                    value={formData.ngayHenGiao}
                                                    onChange={handleChange}
                                                    className="input-primary pl-11!"
                                                />
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

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={prevStep}
                            className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 p-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
                        >
                            Quay Lại
                        </button>
                        
                        <button 
                            type="button"
                            onClick={handleSaveCar}
                            disabled={loading}
                            className="flex-2 btn-primary bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-indigo-600 shadow-blue-200 dark:shadow-blue-900/30 hover:shadow-blue-300 dark:hover:shadow-blue-900/50 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang Lưu...' : 'Lưu Xe & Tiếp Tục'}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Step 3: Hồ Sơ (Updated Flow) */}
            {activeStep === 3 && (
                <motion.div 
                    key="step4"
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
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Cập Nhật Hồ Sơ</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bổ sung thông tin pháp lý</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
                         <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Trạng Thái Hồ Sơ</label>
                            <div className="relative group">
                                <select
                                    name="hoSo_trangThai"
                                    value={formData.hoSo_trangThai}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hoSo_trangThai: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm font-bold text-gray-800 dark:text-white outline-none focus:border-blue-500 appearance-none pr-10"
                                >
                                    <option value="CHUA_CAN">Chưa cần rút (Xe biển tỉnh/HN)</option>
                                    <option value="HUA_RUT">Chủ cũ hứa rút</option>
                                    <option value="DANG_RUT">Đang làm thủ tục rút</option>
                                    <option value="DA_RUT">Đã rút (Cầm hồ sơ gốc)</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Nơi Giữ Hồ Sơ Hiện Tại</label>
                            <div className="relative group">
                                <select
                                    name="hoSo_noiGiu"
                                    value={formData.hoSo_noiGiu}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hoSo_noiGiu: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm outline-none focus:border-blue-500 dark:text-white appearance-none pr-10"
                                >
                                    <option value="CHU_CU">Chủ cũ đang giữ</option>
                                    <option value="CUA_HANG">Cửa hàng đang giữ</option>
                                    <option value="CONG_AN">Đang nộp công an</option>
                                    <option value="DICH_VU">Dịch vụ đang làm</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                            </div>
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Ngày Hẹn (Nếu có)</label>
                                <input
                                    type="date"
                                    name="hoSo_ngayHen"
                                    value={formData.hoSo_ngayHen}
                                    onChange={handleChange}
                                    className="input-primary"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Người Phụ Trách</label>
                                <input
                                    type="text"
                                    name="hoSo_nguoiPhuTrach"
                                    value={formData.hoSo_nguoiPhuTrach}
                                    onChange={handleChange}
                                    className="input-primary"
                                    placeholder="Tên..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={() => router.push('/cars')}
                            className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 p-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
                        >
                            Bỏ Qua
                        </button>
                        <button 
                            type="button"
                            onClick={handleUpdateDocs}
                            disabled={loading}
                            className="flex-2 btn-primary bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-600 dark:to-emerald-600 shadow-green-200 dark:shadow-green-900/30 hover:shadow-green-300 dark:hover:shadow-green-900/50 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang Xử Lý...' : (
                                <span className="flex items-center">
                                    <CheckCircle size={20} className="mr-2" strokeWidth={2.5}/> Hoàn Tất Hồ Sơ
                                </span>
                            )}
                        </button>
                    </div>
                </motion.div>
            )}

        </AnimatePresence>

        {/* Prompt Modal */}
        <AnimatePresence>
            {showDocsPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-800"
                    >
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto mb-4">
                            <CheckCircle size={24} className="text-green-600 dark:text-green-500" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">Đã Lưu Xe Thành Công!</h3>
                        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
                            Bạn có muốn nhập tiếp thông tin <strong>Hồ Sơ & Pháp Lý</strong> ngay bây giờ không?
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => {
                                    setShowDocsPrompt(false);
                                    setActiveStep(3);
                                }}
                                className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-colors"
                            >
                                Có, nhập hồ sơ luôn
                            </button>
                            <button 
                                onClick={() => {
                                    setShowDocsPrompt(false);
                                    router.push('/cars');
                                    router.refresh();
                                }}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Không, để sau
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        {/* Draft Prompt Modal */}
        <AnimatePresence>
            {showDraftPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-800"
                    >
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full mx-auto mb-4">
                            <FileText size={24} className="text-blue-600 dark:text-blue-500" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">Phát Hiện Bản Nháp Cũ</h3>
                        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
                            Bạn có muốn khôi phục dữ liệu xe <strong>{pendingDraftData?.dongXe || 'Chưa đặt tên'}</strong> đang nhập dở không?
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleRestoreDraft}
                                className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-colors"
                            >
                                Khôi Phục Bản Nháp
                            </button>
                            <button 
                                onClick={handleDiscardDraft}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-red-500 dark:text-red-400 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Hủy Bỏ, Tạo Mới
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </form>
    </div>
  );
}
