'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Clock, FileText, ArrowRight, User } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { updateCarDocsAction } from '@/app/actions';

const DOC_STEPS = [
  { key: 'CHUA_CAN', label: 'Chưa Cần', desc: 'Hồ sơ chưa cần rút hoặc chưa xử lý' },
  { key: 'HUA_RUT', label: 'Hứa Rút', desc: 'Đã liên hệ chủ cũ, hẹn ngày rút' },
  { key: 'DANG_RUT', label: 'Đang Rút', desc: 'Đã nộp hồ sơ lên cơ quan, chờ kết quả' },
  { key: 'DA_RUT', label: 'Đã Rút', desc: 'Đã cầm hồ sơ gốc trên tay' },
];

export default function DocsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    trangThai: 'CHUA_CAN',
    noiGiuHoSo: 'CHU_CU',
    ngayHenRut: '',
    nguoiChiuTrachNhiem: ''
  });

  useEffect(() => {
    async function fetchCar() {
        const resolvedParams = await params;
        const res = await fetch(`/api/cars/${resolvedParams.id}`);
        if (res.ok) {
            const data = await res.json();
            setCar(data);
            if (data.hoSo) {
                setFormData({
                    trangThai: data.hoSo.trangThai || 'CHUA_CAN',
                    noiGiuHoSo: data.hoSo.noiGiuHoSo || 'CHU_CU',
                    ngayHenRut: data.hoSo.ngayHenRut ? data.hoSo.ngayHenRut.split('T')[0] : '',
                    nguoiChiuTrachNhiem: data.hoSo.nguoiChiuTrachNhiem || ''
                });
            }
        }
    }
    fetchCar();
  }, [params]);

  const handleSubmit = async () => {
    setLoading(true);
    const resolvedParams = await params;
    
    try {
        const result = await updateCarDocsAction(parseInt(resolvedParams.id), formData);

        if (!result.success) throw new Error(result.error || 'Failed');
        router.push(`/cars/${resolvedParams.id}`);
        router.refresh();
    } catch (err) {
        alert((err as Error).message);
    } finally {
        setLoading(false);
    }
  };

  if (!car) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner /></div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-24 p-4">
      <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">Tiến Độ Hồ Sơ</h1>
          <div className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              {car.bienSo}
          </div>
      </div>

      {/* 1. Timeline Stepper */}
      <div className="relative mb-8 pl-4">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
              {DOC_STEPS.map((step, idx) => {
                  const isActive = step.key === formData.trangThai;
                  const isPast = DOC_STEPS.findIndex(s => s.key === formData.trangThai) > idx;
                  
                  return (
                      <div 
                        key={step.key} 
                        className={`relative flex items-start pl-8 cursor-pointer transition-all ${isActive ? 'scale-105' : 'opacity-60'}`}
                        onClick={() => setFormData(prev => ({ ...prev, trangThai: step.key }))}
                      >
                          {/* Dot */}
                          <div className={`absolute left-2.5 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10 bg-white 
                              ${isActive || isPast ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}
                          `}>
                              {(isActive || isPast) && <CheckCircle size={12} className="text-white absolute top-0 left-0" />}
                          </div>

                          <div className={`bg-white p-4 rounded-xl border w-full shadow-sm transition-colors
                              ${isActive ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'}
                          `}>
                              <h3 className={`font-bold text-sm ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                                  {step.label}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>

      {/* 2. Detail Form */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 text-sm flex items-center mb-2">
              <FileText size={16} className="mr-2 text-orange-500"/> Chi Tiết Hồ Sơ
          </h3>

          <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Nơi Giữ Hồ Sơ</label>
              <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none"
                  value={formData.noiGiuHoSo}
                  onChange={e => setFormData({...formData, noiGiuHoSo: e.target.value})}
              >
                  <option value="CHU_CU">Chủ cũ đang giữ</option>
                  <option value="CUA_HANG">Cửa hàng đang giữ</option>
                  <option value="CONG_AN">Đang nộp công an</option>
                  <option value="DICH_VU">Dịch vụ đang làm</option>
              </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Ngày Hẹn Rút</label>
                  <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input
                          type="date"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-9 text-sm outline-none"
                          value={formData.ngayHenRut}
                          onChange={e => setFormData({...formData, ngayHenRut: e.target.value})}
                      />
                  </div>
              </div>
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Người Phụ Trách</label>
                  <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input
                          type="text"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-9 text-sm outline-none"
                          placeholder="Tên..."
                          value={formData.nguoiChiuTrachNhiem}
                          onChange={e => setFormData({...formData, nguoiChiuTrachNhiem: e.target.value})}
                      />
                  </div>
              </div>
          </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
              {loading ? 'Đang Lưu...' : (
                  <>Lưu Cập Nhật <ArrowRight size={18} className="ml-2"/></>
              )}
          </button>
      </div>
    </div>
  );
}