'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, DollarSign, CheckCircle, ArrowRight, Wallet } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import SellCarSkeleton from '@/components/skeletons/SellCarSkeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const sellCarSchema = z.object({
  khachMua: z.string().min(1, 'Vui lòng nhập tên khách mua'),
  giaBan: z.number().min(1000000, 'Giá bán phải lớn hơn 1.000.000 đ'),
  daThuDuTien: z.boolean(),
  daGiaoXe: z.boolean(),
});

type SellCarFormValues = z.infer<typeof sellCarSchema>;

export default function SellCarPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SellCarFormValues>({
    resolver: zodResolver(sellCarSchema),
    mode: 'onChange',
    defaultValues: {
      khachMua: '',
      giaBan: 0,
      daThuDuTien: false,
      daGiaoXe: false,
    },
  });

  const formData = watch();

  // 1. Fetch Data with React Query
  const { data: car, isLoading } = useQuery({
    queryKey: ['car', resolvedParams.id],
    queryFn: async () => {
      const res = await fetch(`/api/cars/${resolvedParams.id}`);
      if (!res.ok) throw new Error('Failed to fetch car');
      return res.json();
    },
  });

  // Auto-fill price when data loads
  useEffect(() => {
    if (car && formData.giaBan === 0) {
      setValue('giaBan', car.tongGiaMua + 10000000);
    }
  }, [car, setValue, formData.giaBan]);

  // 2. Optimistic Mutation
  const { mutate: sellCar, isPending } = useMutation({
    mutationFn: async (data: SellCarFormValues) => {
      const res = await fetch(`/api/cars/${resolvedParams.id}/sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to sell car');
      return result;
    },
    onMutate: async (newData) => {
      // Optimistic UI: Giả lập thành công ngay lập tức
      setShowSuccess(true);
      
      // Cancel queries để tránh overwrite dữ liệu cũ
      await queryClient.cancelQueries({ queryKey: ['car', resolvedParams.id] });

      // Snapshot giá trị cũ
      const previousCar = queryClient.getQueryData(['car', resolvedParams.id]);

      // Optimistic update
      queryClient.setQueryData(['car', resolvedParams.id], (old: any) => ({
        ...old,
        trangThai: 'DA_BAN',
      }));

      return { previousCar };
    },
    onError: (err: any, newData, context) => {
      // Rollback nếu lỗi
      setShowSuccess(false);
      queryClient.setQueryData(['car', resolvedParams.id], context?.previousCar);
      toast.error(err.message);
    },
    onSettled: () => {
      // Invalidate để fetch lại dữ liệu mới nhất
      queryClient.invalidateQueries({ queryKey: ['car', resolvedParams.id] });
      
      // Redirect sau 2s
      setTimeout(() => {
          router.push(`/cars/${resolvedParams.id}`);
          router.refresh();
      }, 2000);
    },
  });

  const onSubmit = (data: SellCarFormValues) => {
    sellCar(data);
  };

  if (showSuccess) return (
      <div className="fixed inset-0 bg-green-600 z-50 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle size={48} className="text-green-600" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold mb-2">CHỐT ĐƠN THÀNH CÔNG!</h1>
          <p className="text-lg opacity-90">Lợi nhuận: +{(formData.giaBan - (car?.tongGiaMua || 0)).toLocaleString()} đ</p>
      </div>
  );

  if (!car || isLoading) return <SellCarSkeleton />;

  const isOverdue = car.hoSo?.trangThai === 'QUA_HAN';
  const profitPreview = formData.giaBan - car.tongGiaMua; // Đơn giản hóa, chưa trừ chi phí

  return (
    <div className="bg-gray-50 min-h-screen pb-24 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Chốt Bán Xe</h1>
          <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {car.bienSo || 'Chưa biển'}
          </div>
      </div>

      {isOverdue && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start animate-bounce-slow">
              <AlertTriangle className="text-red-600 mr-3 shrink-0" />
              <div>
                  <h3 className="font-bold text-red-800">KHÔNG THỂ BÁN XE NÀY!</h3>
                  <p className="text-sm text-red-600 mt-1">Hồ sơ xe đang quá hạn. Vui lòng xử lý hồ sơ trước khi tạo phiếu bán.</p>
              </div>
          </div>
      )}

      {/* Error handling moved to toast in onError */}
      {/* {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-4 rounded-xl border border-red-200 text-sm font-medium">
              {error}
          </div>
      )} */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={isOverdue} className={isOverdue ? 'opacity-50 pointer-events-none' : ''}>
            
            {/* Card 1: Thông tin khách & Giá */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center text-sm uppercase">
                    <DollarSign size={16} className="mr-2 text-green-600"/> Thông Tin Giao Dịch
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Khách Mua</label>
                        <input
                            {...register('khachMua')}
                            type="text"
                            className={`input-primary font-bold text-gray-800 ${errors.khachMua ? 'border-red-500 ring-red-200' : ''}`}
                            placeholder="Nguyễn Văn A"
                        />
                        {errors.khachMua && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.khachMua.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Giá Chốt Bán</label>
                        <div className="relative">
                            <input
                                {...register('giaBan', { valueAsNumber: true })}
                                type="number"
                                inputMode="numeric"
                                className={`w-full bg-white border rounded-xl p-3 pr-12 text-xl font-bold text-green-700 outline-none focus:ring-2 ${errors.giaBan ? 'border-red-500 focus:ring-red-200' : 'border-green-200 focus:ring-green-500'}`}
                            />
                            <span className="absolute right-4 top-4 text-green-600 text-xs font-bold">VNĐ</span>
                        </div>
                        {errors.giaBan && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.giaBan.message}</p>
                        )}
                    </div>

                    {/* Profit Preview */}
                    <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">Lợi nhuận tạm tính:</span>
                        <span className={`font-bold ${profitPreview > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {profitPreview > 0 ? '+' : ''}{profitPreview.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card 2: Trạng thái thanh toán */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-4">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center text-sm uppercase">
                    <Wallet size={16} className="mr-2 text-blue-600"/> Trạng Thái
                </h3>
                
                <div className="space-y-3">
                    <label className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer ${formData.daThuDuTien ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${formData.daThuDuTien ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                            {formData.daThuDuTien && <CheckCircle size={12} className="text-white"/>}
                        </div>
                        <input
                            {...register('daThuDuTien')}
                            type="checkbox"
                            className="hidden"
                        />
                        <div>
                            <p className="font-bold text-sm text-gray-800">Đã thu đủ tiền</p>
                            <p className="text-xs text-gray-500">Khách đã thanh toán 100%</p>
                        </div>
                    </label>

                    <label className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer ${formData.daGiaoXe ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${formData.daGiaoXe ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                            {formData.daGiaoXe && <CheckCircle size={12} className="text-white"/>}
                        </div>
                        <input
                            {...register('daGiaoXe')}
                            type="checkbox"
                            className="hidden"
                        />
                        <div>
                            <p className="font-bold text-sm text-gray-800">Đã giao xe</p>
                            <p className="text-xs text-gray-500">Đã bàn giao chìa khóa & giấy tờ</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 flex gap-3 z-999 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold hover:bg-gray-200 active:scale-95 transition-all"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={isPending || isOverdue}
                    className="flex-2 bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                    {isPending ? 'Đang Xử Lý...' : (
                        <>
                            Xác Nhận Bán <ArrowRight size={18} className="ml-2"/>
                        </>
                    )}
                </button>
            </div>
            
            {/* Spacer for fixed bottom bar */}
            <div className="h-32"></div>
        </fieldset>
      </form>
    </div>
  );
}
