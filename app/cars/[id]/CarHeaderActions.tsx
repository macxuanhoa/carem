'use client';

import { Edit, Trash2, MoreVertical, Printer, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { deleteCar } from '@/app/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CarHeaderActions({ id }: { id: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
      setShowDeleteConfirm(false);
      try {
          toast.promise(deleteCar(id), {
              loading: 'Đang xóa...',
              success: 'Đã xóa xe thành công',
              error: (err) => `Lỗi: ${err.message}`
          });
      } catch (e) {
          console.error(e);
      }
  };

  return (
    <div className="relative">
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 -mr-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
            <MoreVertical size={20} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
            <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 z-100 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">Tác vụ</div>
                    
                    <Link 
                        href={`/cars/${id}/edit`} 
                        className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <Edit size={16} className="mr-2" />
                        Chỉnh sửa
                    </Link>

                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">In Ấn</div>

                    <Link 
                        href={`/cars/${id}/print/deposit`} 
                        target="_blank"
                        className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <FileText size={16} className="mr-2 text-yellow-500" />
                        Giấy biên nhận cọc
                    </Link>

                    <Link 
                        href={`/cars/${id}/print/contract`} 
                        target="_blank"
                        className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <Printer size={16} className="mr-2 text-green-500" />
                        Hợp đồng mua bán
                    </Link>

                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>

                    <button 
                        onClick={() => {
                            setIsOpen(false);
                            setShowDeleteConfirm(true);
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <Trash2 size={16} className="mr-2" />
                        Xóa xe
                    </button>
                </div>
            </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4">
                        <Trash2 size={24} className="text-red-600 dark:text-red-500" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">Xóa xe này?</h3>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
                        Hành động này sẽ xóa vĩnh viễn toàn bộ dữ liệu liên quan (Hồ sơ, Chi phí, Lịch sử...). Không thể hoàn tác.
                    </p>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-red-900/20 transition-colors"
                        >
                            Xóa Ngay
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
