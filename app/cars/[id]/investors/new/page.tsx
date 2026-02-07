'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle, User, DollarSign, FileText 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewInvestorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nguoiGop: '',
    tyLeGop: 50,
    soTienGop: 0,
    giayToLienQuan: '' // URL ảnh nếu có (feature sau)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const resolvedParams = await params;

    try {
      const res = await fetch(`/api/cars/${resolvedParams.id}/investors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to add investor');

      toast.success('Đã thêm nhà đầu tư thành công!');
      
      router.push(`/cars/${resolvedParams.id}`);
      router.refresh();
    } catch (error) {
      toast.error('Lỗi', { description: 'Không thể thêm nhà đầu tư.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white sticky top-0 z-30 px-4 py-3 shadow-sm flex items-center">
         <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
         </button>
         <h1 className="font-bold text-lg text-gray-800 ml-2">Thêm Nhà Đầu Tư</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center text-sm uppercase">
                <User size={16} className="mr-2 text-blue-600"/> Thông Tin Người Góp
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Họ & Tên</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
                        placeholder="Nguyễn Văn A"
                        value={formData.nguoiGop}
                        onChange={e => setFormData({...formData, nguoiGop: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Tỷ Lệ Góp (%)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            max="100"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
                            value={formData.tyLeGop}
                            onChange={e => setFormData({...formData, tyLeGop: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Số Tiền (VNĐ)</label>
                        <input
                            type="number"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
                            value={formData.soTienGop}
                            onChange={e => setFormData({...formData, soTienGop: Number(e.target.value)})}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Ghi Chú / Link Hợp Đồng</label>
                    <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
                        placeholder="Link ảnh chuyển khoản hoặc ghi chú..."
                        value={formData.giayToLienQuan}
                        onChange={e => setFormData({...formData, giayToLienQuan: e.target.value})}
                    />
                </div>
            </div>
        </div>

        <button 
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center"
        >
            {loading ? 'Đang Xử Lý...' : (
                <>
                    <CheckCircle size={20} className="mr-2"/> Xác Nhận Góp Vốn
                </>
            )}
        </button>
      </form>
    </div>
  );
}
