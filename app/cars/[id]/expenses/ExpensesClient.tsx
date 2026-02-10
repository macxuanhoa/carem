'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Plus, DollarSign, User, FileText, 
  CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { CarWithRelations } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, ExpenseFormData } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ExpensesClient({ car }: { car: CarWithRelations }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: {
        loaiChiPhi: 'Sửa chữa',
        giaDuKien: 0,
        nguoiBaoGia: '',
        ghiChu: ''
    }
  });

  const onSubmit = async (data: ExpenseFormData) => {
    setLoading(true);
    
    try {
      const res = await fetch(`/api/cars/${car.id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create expense');

      toast.success('Đã gửi đề xuất chi phí!', {
          description: 'Vui lòng chờ quản lý duyệt.'
      });
      
      reset();
      setIsAdding(false);
      router.refresh();
    } catch (error) {
      toast.error('Lỗi', { description: 'Không thể tạo chi phí.' });
    } finally {
      setLoading(false);
    }
  };

  const totalCost = car.chiPhi.reduce((sum, c) => sum + (c.giaThucTe || 0), 0);
  const pendingCount = car.chiPhi.filter(c => c.trangThai === 'CHO_DUYET').length;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
       {/* Header */}
       <div className="bg-white sticky top-0 z-30 px-4 py-3 shadow-sm flex items-center justify-between">
         <div className="flex items-center">
            <Link href={`/cars/${car.id}`} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <ArrowLeft size={20} />
            </Link>
            <div className="ml-2">
                <h1 className="font-bold text-lg text-gray-800">Chi Phí Xe</h1>
                <p className="text-xs text-gray-500">{car.dongXe} - {car.bienSo}</p>
            </div>
         </div>
         <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-blue-600 text-white p-2 rounded-full shadow-lg shadow-blue-200 active:scale-90 transition-transform"
         >
            <Plus size={24} className={`transition-transform ${isAdding ? 'rotate-45' : ''}`}/>
         </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Card */}
        <div className="bg-linear-to-r from-orange-500 to-red-500 text-white p-5 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-orange-100 text-xs uppercase font-bold">Tổng Chi Phí (Đã Duyệt)</p>
                    <h2 className="text-3xl font-bold mt-1">{totalCost.toLocaleString()}</h2>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                    <DollarSign size={24} className="text-white"/>
                </div>
            </div>
            {pendingCount > 0 && (
                <div className="mt-4 bg-white/20 p-2 rounded-lg flex items-center text-xs font-bold">
                    <AlertCircle size={14} className="mr-2 text-yellow-300"/>
                    <span>Có {pendingCount} khoản đang chờ duyệt</span>
                </div>
            )}
        </div>

        {/* Add Form */}
        {isAdding && (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 animate-in slide-in-from-top-4">
                <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase">Thêm Chi Phí Mới</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Loại Chi Phí</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none"
                            {...register('loaiChiPhi')}
                        >
                            <option value="Sửa chữa">Sửa chữa / Bảo dưỡng</option>
                            <option value="Xăng xe">Xăng xe / Đi lại</option>
                            <option value="Hoa hồng">Hoa hồng môi giới</option>
                            <option value="Giấy tờ">Phí giấy tờ / Công chứng</option>
                            <option value="Khác">Khác</option>
                        </select>
                        {errors.loaiChiPhi && <p className="text-red-500 text-xs mt-1">{errors.loaiChiPhi.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Giá Dự Kiến</label>
                        <Input 
                            type="number" 
                            {...register('giaDuKien')}
                        />
                        {errors.giaDuKien && <p className="text-red-500 text-xs mt-1">{errors.giaDuKien.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Người Đề Xuất</label>
                        <Input 
                            type="text" 
                            placeholder="Tên của bạn"
                            {...register('nguoiBaoGia')}
                        />
                        {errors.nguoiBaoGia && <p className="text-red-500 text-xs mt-1">{errors.nguoiBaoGia.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Ghi Chú</label>
                        <textarea 
                            rows={2}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none"
                            {...register('ghiChu')}
                        />
                    </div>
                    <Button 
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Đang gửi...' : 'Gửi Đề Xuất'}
                    </Button>
                </div>
            </form>
        )}

        {/* List */}
        <div className="space-y-3">
            {car.chiPhi.map((exp) => (
                <div key={exp.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex justify-between items-start">
                    <div className="flex items-start">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 mt-1 ${
                             exp.trangThai === 'CHO_DUYET' ? 'bg-purple-100 text-purple-600' :
                             exp.trangThai === 'DA_DUYET' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">{exp.loaiChiPhi}</h4>
                            <p className="text-xs text-gray-500">{exp.nguoiBaoGia} • {new Date(exp.createdAt).toLocaleDateString()}</p>
                            {exp.ghiChu && <p className="text-xs text-gray-600 mt-1 italic">"{exp.ghiChu}"</p>}
                            
                            <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                exp.trangThai === 'CHO_DUYET' ? 'bg-purple-50 text-purple-600' :
                                exp.trangThai === 'DA_DUYET' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                                {exp.trangThai}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold ${exp.trangThai === 'TU_CHOI' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {exp.giaDuKien.toLocaleString()}
                        </p>
                        {exp.trangThai === 'DA_DUYET' && exp.giaThucTe !== exp.giaDuKien && (
                             <p className="text-xs text-green-600 font-bold">
                                Thực: {exp.giaThucTe.toLocaleString()}
                             </p>
                        )}
                    </div>
                </div>
            ))}
            {car.chiPhi.length === 0 && !isAdding && (
                <div className="text-center py-10 text-gray-400 text-sm">Chưa có chi phí nào.</div>
            )}
        </div>
      </div>
    </div>
  );
}
