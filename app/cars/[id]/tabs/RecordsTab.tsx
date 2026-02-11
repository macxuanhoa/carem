'use client';

import { 
    ShieldAlert, FileText, Clock 
} from 'lucide-react';
import Link from 'next/link';
import { RecordsTabProps } from './types';

export default function RecordsTab({ car, isOverdue }: RecordsTabProps) {
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
                <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl flex items-start shadow-sm">
                    <ShieldAlert className="text-rose-600 dark:text-rose-400 mr-3 shrink-0" size={20} />
                    <div>
                        <h3 className="text-rose-800 dark:text-rose-300 font-bold text-sm">Hồ sơ quá hạn!</h3>
                        <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">Cần xử lý ngay để tránh rủi ro.</p>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                     <span className="text-slate-800 dark:text-white text-sm font-bold uppercase flex items-center">
                        <FileText size={16} className="mr-2 text-violet-600"/> Hồ Sơ Pháp Lý
                     </span>
                     <Link href={`/cars/${car.id}/docs`} className="text-violet-600 text-xs font-bold hover:text-violet-500">
                        Chỉnh sửa
                     </Link>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <span className="text-slate-500 text-xs font-bold uppercase">Trạng thái</span>
                        <span className={`font-bold text-xs px-2 py-1 rounded-md ${car.hoSo?.trangThai === 'QUA_HAN' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'}`}>
                            {getDocStatusLabel(car.hoSo?.trangThai || 'CHUA_CO')}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <span className="text-slate-500 text-xs font-bold uppercase">Nơi lưu giữ</span>
                        <span className="text-slate-900 dark:text-white font-bold text-sm">{car.hoSo?.noiGiuHoSo || 'Chưa cập nhật'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white text-xs uppercase flex items-center mb-4">
                    <Clock size={16} className="mr-2 text-slate-400"/> Lịch sử hoạt động
                </h3>
                <div className="border-l-2 border-slate-100 dark:border-slate-800 ml-1.5 space-y-6">
                    {car.lichSu?.map((log) => (
                        <div key={log.id} className="ml-5 relative">
                            <div className="absolute -left-[25px] top-1 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                            <p className="text-[10px] text-slate-400 font-mono mb-0.5">
                                {new Date(log.createdAt).toLocaleDateString('vi-VN')} {new Date(log.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <p className="text-sm text-slate-800 dark:text-white font-medium">{log.chiTiet}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Bởi <span className="font-bold text-slate-600 dark:text-slate-400">{log.nguoiThucHien}</span></p>
                        </div>
                    ))}
                    {(!car.lichSu || car.lichSu.length === 0) && (
                        <div className="ml-5 text-slate-400 text-xs italic">Chưa có lịch sử.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
