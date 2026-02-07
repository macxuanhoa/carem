'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle, CreditCard, Car, MapPin, 
  User, Link as LinkIcon, Calendar, FileText 
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { updateCar } from '@/app/actions';
import ImageUpload from '@/components/ImageUpload';

const formatNumber = (num: number | string) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function EditCarForm({ car }: { car: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  
  // Initialize with Car Data
  const [formData, setFormData] = useState({
    dongXe: car.dongXe || '',
    namSanXuat: car.namSanXuat || new Date().getFullYear(),
    mauXe: car.mauXe || '',
    bienSo: car.bienSo || '',
    nguoiBan: car.nguoiBan || '',
    tinhThanh: car.tinhThanh || '',
    soTienCoc: car.soTienCoc || 0,
    tongGiaMua: car.tongGiaMua || 0,
    ngayHenGiao: car.ngayHenGiao ? new Date(car.ngayHenGiao).toISOString().split('T')[0] : '',
    facebookLink: car.facebookLink || '',
    nguoiGiuTien: car.nguoiGiuTien || '',
    trangThai: car.trangThai || 'TIM_THAY',
    tinhTrang: car.tinhTrang || 90,
    soKhung: car.soKhung || '',
    soMay: car.soMay || '',
    odo: car.odo || 0,
    hinhAnh: car.hinhAnh ? JSON.parse(car.hinhAnh) : [],
    // Docs
    hoSo_trangThai: car.hoSo?.trangThai || 'CHUA_CAN',
    hoSo_noiGiu: car.hoSo?.noiGiuHoSo || 'CHU_CU',
    hoSo_ngayHen: car.hoSo?.ngayHenRut ? new Date(car.hoSo.ngayHenRut).toISOString().split('T')[0] : '',
    hoSo_nguoiPhuTrach: car.hoSo?.nguoiChiuTrachNhiem || ''
  });

  const [displayPrice, setDisplayPrice] = useState(formatNumber(car.tongGiaMua));
  const [displayDeposit, setDisplayDeposit] = useState(formatNumber(car.soTienCoc));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateCar(car.id, formData);
      toast.success('Đã cập nhật thông tin xe!');
      // updateCar handles redirect
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setFormData(prev => {
        // Auto-switch to DANG_BAN if link is added and current status is TIM_THAY
        let newStatus = prev.trangThai;
        if (link && prev.trangThai === 'TIM_THAY') {
            newStatus = 'DANG_BAN';
        }
        return { ...prev, facebookLink: link, trangThai: newStatus };
    });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'tongGiaMua' | 'soTienCoc') => {
      const rawValue = e.target.value.replace(/\./g, '');
      if (!/^\d*$/.test(rawValue)) return;

      const numValue = parseInt(rawValue || '0', 10);
      
      if (field === 'tongGiaMua') {
          setDisplayPrice(formatNumber(rawValue));
          setFormData(prev => ({ ...prev, tongGiaMua: numValue }));
      } else {
          setDisplayDeposit(formatNumber(rawValue));
          setFormData(prev => ({ ...prev, soTienCoc: numValue }));
      }
  };

  const setBrand = (brand: string) => {
      setFormData(prev => ({ ...prev, dongXe: brand + ' ' }));
  };

  const nextStep = () => setActiveStep(prev => prev + 1);
  const prevStep = () => setActiveStep(prev => prev - 1);

  const stepVariants = {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-24 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-30 px-4 py-3 shadow-sm border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
         <div className="flex items-center">
            <Link href={`/cars/${car.id}`} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white rounded-full transition-colors">
                <ArrowLeft size={20} strokeWidth={2.5} />
            </Link>
            <h1 className="font-bold text-lg text-gray-800 dark:text-white ml-2">Sửa Xe</h1>
         </div>
         <div className="flex items-center space-x-1.5">
             {[1, 2, 3, 4].map(step => (
                 <div 
                    key={step} 
                    className={`h-2 rounded-full transition-all duration-500 ease-out ${
                        activeStep >= step 
                            ? 'w-8 bg-linear-to-r from-blue-500 to-blue-600 shadow-blue-200 dark:shadow-blue-900/30 shadow-sm' 
                            : 'w-2 bg-gray-200 dark:bg-gray-700'
                    }`}
                 />
             ))}
         </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 max-w-lg mx-auto">
        <AnimatePresence mode='wait'>
            
            {/* Step 1: Nguồn gốc */}
            {activeStep === 1 && (
                <motion.div 
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                >
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
                        <h3 className="font-bold text-gray-800 dark:text-white">Nguồn Gốc & Liên Hệ</h3>
                        
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Link Bài Đăng</label>
                            <input
                                type="url"
                                name="facebookLink"
                                value={formData.facebookLink}
                                onChange={handleLinkChange}
                                className="input-primary font-medium text-blue-600 dark:text-blue-400"
                                placeholder="https://facebook.com/..."
                            />
                             <p className="text-[10px] text-blue-500 dark:text-blue-400 font-medium mt-1.5">
                                * Tự động chuyển trạng thái "Đang Bán" nếu có link
                            </p>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Trạng Thái Xe (Tùy chọn)</label>
                            <div className="space-y-2">
                                <select
                                    name="trangThai"
                                    value={formData.trangThai}
                                    onChange={(e) => setFormData(prev => ({ ...prev, trangThai: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm font-bold text-gray-800 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-500"
                                >
                                    <option value="TIM_THAY">Tìm Thấy / Đang Tìm</option>
                                    <option value="DANG_BAN">Đang Bán (Có Link)</option>
                                    <option value="DA_COC">Đã Cọc Mua</option>
                                    <option value="XE_DA_VE">Xe Đã Về Kho</option>
                                    <option value="HUY_GIAO_DICH">Hủy Giao Dịch</option>
                                </select>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">
                                    * Để đánh dấu <strong>Đã Bán</strong>, vui lòng dùng chức năng <span className="text-blue-600 dark:text-blue-400 font-bold">Chốt Bán Xe</span> ở màn hình chi tiết.
                                </p>
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
                                    />
                                </div>
                            </div>
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        type="button"
                        onClick={nextStep}
                        className="w-full btn-primary bg-blue-600 dark:bg-blue-600"
                    >
                        Tiếp Theo
                    </button>
                </motion.div>
            )}

            {/* Step 2: Thông tin xe */}
            {activeStep === 2 && (
                <motion.div 
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                >
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
                        <h3 className="font-bold text-gray-800 dark:text-white">Thông Tin Xe</h3>
                        
                        <div>
                             <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Hình Ảnh Xe</label>
                             <ImageUpload
                                value={formData.hinhAnh}
                                onChange={(urls) => setFormData(prev => ({ ...prev, hinhAnh: urls }))}
                                onRemove={(url) => setFormData(prev => ({ ...prev, hinhAnh: prev.hinhAnh.filter((x: string) => x !== url) }))}
                             />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Dòng Xe</label>
                            <input
                                type="text"
                                name="dongXe"
                                value={formData.dongXe}
                                onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-lg font-bold text-gray-800 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Đời Xe</label>
                                <input
                                    type="number"
                                    name="namSanXuat"
                                    value={formData.namSanXuat}
                                    onChange={handleChange}
                                    className="input-primary text-center font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Màu Sắc</label>
                                <input
                                    type="text"
                                    name="mauXe"
                                    value={formData.mauXe}
                                    onChange={handleChange}
                                    className="input-primary text-center font-medium"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Số Khung</label>
                                <input
                                    type="text"
                                    name="soKhung"
                                    value={formData.soKhung}
                                    onChange={handleChange}
                                    className="input-primary text-center font-mono text-xs"
                                    placeholder="----"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Số Máy</label>
                                <input
                                    type="text"
                                    name="soMay"
                                    value={formData.soMay}
                                    onChange={handleChange}
                                    className="input-primary text-center font-mono text-xs"
                                    placeholder="----"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Biển Số</label>
                            <input
                                type="text"
                                name="bienSo"
                                value={formData.bienSo}
                                onChange={handleChange}
                                className="input-primary font-mono uppercase tracking-widest text-center border-dashed"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button type="button" onClick={prevStep} className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 p-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all shadow-sm">Quay Lại</button>
                        <button type="button" onClick={nextStep} className="flex-2 btn-primary bg-blue-600 dark:bg-blue-600">Tiếp Theo</button>
                    </div>
                </motion.div>
            )}

            {/* Step 3: Tài chính */}
            {activeStep === 3 && (
                <motion.div 
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                >
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                        <h3 className="font-bold text-gray-800 dark:text-white">Tài Chính</h3>
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Giá Mua Chốt</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={displayPrice}
                                    onChange={(e) => handleCurrencyChange(e, 'tongGiaMua')}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 pr-12 text-2xl font-bold text-gray-800 dark:text-white"
                                />
                                <span className="absolute right-5 top-5 text-gray-400 dark:text-gray-500 text-sm font-bold">đ</span>
                            </div>
                        </div>

                        <div className="bg-yellow-50/50 dark:bg-yellow-900/10 p-5 rounded-2xl border border-yellow-100 dark:border-yellow-900/20">
                            <label className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase block mb-2">Số Tiền Cọc</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={displayDeposit}
                                    onChange={(e) => handleCurrencyChange(e, 'soTienCoc')}
                                    className="w-full bg-white dark:bg-gray-900 border-2 border-yellow-100 dark:border-yellow-900/30 rounded-xl p-3 pr-10 text-xl font-bold text-red-500 dark:text-red-400"
                                />
                                <span className="absolute right-4 top-4 text-gray-400 dark:text-gray-500 text-xs font-bold">đ</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Tài Khoản Giữ Tiền</label>
                                <input
                                    type="text"
                                    name="nguoiGiuTien"
                                    value={formData.nguoiGiuTien}
                                    onChange={handleChange}
                                    className="input-primary"
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
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={prevStep} className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 p-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all shadow-sm">Quay Lại</button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 active:scale-95 transition-all shadow-sm"
                        >
                            Lưu Ngay
                        </button>
                        <button 
                            type="button"
                            onClick={nextStep}
                            className="flex-1 btn-primary bg-blue-600 dark:bg-blue-600"
                        >
                            Sửa Hồ Sơ
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Step 4: Hồ Sơ (Optional) */}
            {activeStep === 4 && (
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
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Hồ Sơ & Pháp Lý</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Cập nhật thông tin giấy tờ</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
                         <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Trạng Thái Hồ Sơ</label>
                            <select
                                name="hoSo_trangThai"
                                value={formData.hoSo_trangThai}
                                onChange={(e) => setFormData(prev => ({ ...prev, hoSo_trangThai: e.target.value }))}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm font-bold text-gray-800 dark:text-white outline-none focus:border-blue-500"
                            >
                                <option value="CHUA_CAN">Chưa cần rút (Xe biển tỉnh/HN)</option>
                                <option value="HUA_RUT">Chủ cũ hứa rút</option>
                                <option value="DANG_RUT">Đang làm thủ tục rút</option>
                                <option value="DA_RUT">Đã rút (Cầm hồ sơ gốc)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Nơi Giữ Hồ Sơ Hiện Tại</label>
                            <select
                                name="hoSo_noiGiu"
                                value={formData.hoSo_noiGiu}
                                onChange={(e) => setFormData(prev => ({ ...prev, hoSo_noiGiu: e.target.value }))}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm outline-none focus:border-blue-500 dark:text-white"
                            >
                                <option value="CHU_CU">Chủ cũ đang giữ</option>
                                <option value="CUA_HANG">Cửa hàng đang giữ</option>
                                <option value="CONG_AN">Đang nộp công an</option>
                                <option value="DICH_VU">Dịch vụ đang làm</option>
                            </select>
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
                        <button type="button" onClick={prevStep} className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 p-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all shadow-sm">Quay Lại</button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-2 btn-primary bg-green-600 dark:bg-green-600"
                        >
                            {loading ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
                        </button>
                    </div>
                </motion.div>
            )}

        </AnimatePresence>
      </form>
    </div>
  );
}
