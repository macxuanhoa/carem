'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { updateCar } from '@/app/actions';
import CarForm from '@/components/CarForm';
import { type CarFormData } from '@/lib/schemas';

export default function EditCarForm({ car }: { car: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Prepare default values
    const defaultValues: Partial<CarFormData> = {
        dongXe: car.dongXe,
        namSanXuat: car.namSanXuat,
        mauXe: car.mauXe,
        soKhung: car.soKhung || '',
        soMay: car.soMay || '',
        bienSo: car.bienSo || '',
        tinhTrang: car.tinhTrang || 95,
        tongGiaMua: car.tongGiaMua,
        soTienCoc: car.soTienCoc,
        nguoiBan: car.nguoiBan || '',
        tinhThanh: car.tinhThanh || '',
        facebookLink: car.facebookLink || '',
        nguoiGiuTien: car.nguoiGiuTien || '',
        trangThai: car.trangThai,
        // New fields
        nguonGoc: car.nguonGoc || 'MUA_DAN',
        soDienThoai: car.soDienThoai || '',
        
        // Use array directly
        hinhAnh: car.hinhAnh || [],
        
        // Format dates to YYYY-MM-DD for input[type=date]
        ngayHenGiao: car.ngayHenGiao ? new Date(car.ngayHenGiao).toISOString().split('T')[0] : '',
        ngayCoc: car.ngayCoc ? new Date(car.ngayCoc).toISOString().split('T')[0] : '',
        
        // Ho So
        hoSo_trangThai: car.hoSo?.trangThai || 'CHUA_CAN',
        hoSo_noiGiu: car.hoSo?.noiGiuHoSo || 'CHU_CU',
        hoSo_nguoiPhuTrach: car.hoSo?.nguoiChiuTrachNhiem || '',
        hoSo_ngayHen: car.hoSo?.ngayHenRut ? new Date(car.hoSo.ngayHenRut).toISOString().split('T')[0] : '',
    };

    const handleSave = async (data: CarFormData) => {
        setLoading(true);
        try {
            const result = await updateCar(car.id, data);
            
            if (result.success) {
                toast.success('Đã cập nhật thông tin xe!');
                router.push(`/cars/${car.id}`);
                router.refresh();
            } else {
                toast.error(result.error || 'Có lỗi xảy ra khi cập nhật');
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi cập nhật');
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 font-sans">
             {/* Header */}
            <div className="bg-white dark:bg-slate-900 sticky top-0 z-30 px-4 py-3 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href={`/cars/${car.id}`} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="font-bold text-lg text-slate-800 dark:text-white ml-2">Sửa Xe</h1>
                </div>
            </div>

            <div className="p-5 max-w-lg mx-auto">
                <CarForm 
                    mode="edit"
                    defaultValues={defaultValues}
                    onSubmit={handleSave}
                    loading={loading}
                />
            </div>
        </div>
    );
}
