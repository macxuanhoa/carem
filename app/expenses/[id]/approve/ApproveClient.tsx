'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle, XCircle, DollarSign, FileText, AlertTriangle 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Prisma } from '@prisma/client';

type ExpenseWithRelations = Prisma.ChiPhiXeGetPayload<{
  include: {
    xeMuaVao: true;
  }
}>;

export default function ApproveExpenseClient({ expense }: { expense: ExpenseWithRelations }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);
  
  // Form State
  const [finalPrice, setFinalPrice] = useState(expense.giaDuKien);
  const [approverName, setApproverName] = useState('Admin'); // Mock user
  const [rejectReason, setRejectReason] = useState('');

  const handleAction = async () => {
    if (!actionType) return;
    setLoading(true);
    
    try {
      const res = await fetch(`/api/expenses/${expense.id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: actionType,
            giaThucTe: finalPrice,
            nguoiDuyet: approverName,
            lyDoTuChoi: rejectReason
        }),
      });

      if (!res.ok) throw new Error('Action failed');

      toast.success(actionType === 'APPROVE' ? 'Đã duyệt chi phí!' : 'Đã từ chối chi phí!');
      
      router.push('/expenses');
      router.refresh();
    } catch (error) {
      toast.error('Lỗi', { description: 'Không thể xử lý yêu cầu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 px-4 py-3 shadow-sm flex items-center">
         <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
         </button>
         <h1 className="font-bold text-lg text-gray-800 ml-2">Xử Lý Chi Phí</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {/* Info Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                        {expense.loaiChiPhi}
                    </span>
                    <h2 className="text-2xl font-bold mt-2">{expense.giaDuKien.toLocaleString()}</h2>
                    <p className="text-xs text-gray-400">Giá dự kiến</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl">
                    <DollarSign size={24} className="text-gray-400"/>
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
                {expense.xeMuaVao && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Xe liên quan:</span>
                        <span className="font-bold text-gray-800">{expense.xeMuaVao.dongXe}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Người đề xuất:</span>
                    <span className="font-bold text-gray-800">{expense.nguoiBaoGia}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ngày gửi:</span>
                    <span className="font-bold text-gray-800">{new Date(expense.createdAt).toLocaleDateString()}</span>
                </div>
                {expense.ghiChu && (
                    <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 italic">
                        "{expense.ghiChu}"
                    </div>
                )}
            </div>
        </div>

        {/* Action Form */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">Quyết Định Duyệt</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                    onClick={() => setActionType('APPROVE')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        actionType === 'APPROVE' 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-100 bg-white text-gray-400 hover:border-green-200'
                    }`}
                >
                    <CheckCircle size={24} className="mb-2" />
                    <span className="font-bold text-sm">Duyệt Chi</span>
                </button>

                <button 
                    onClick={() => setActionType('REJECT')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        actionType === 'REJECT' 
                        ? 'border-red-500 bg-red-50 text-red-700' 
                        : 'border-gray-100 bg-white text-gray-400 hover:border-red-200'
                    }`}
                >
                    <XCircle size={24} className="mb-2" />
                    <span className="font-bold text-sm">Từ Chối</span>
                </button>
            </div>

            {actionType === 'APPROVE' && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Giá Chốt Thực Tế (VNĐ)</label>
                        <input
                            type="number"
                            className="w-full bg-green-50 border border-green-200 rounded-xl p-3 text-lg font-bold text-green-700 outline-none focus:ring-2 focus:ring-green-500"
                            value={finalPrice}
                            onChange={e => setFinalPrice(Number(e.target.value))}
                        />
                        {finalPrice !== expense.giaDuKien && (
                             <p className="text-xs text-orange-500 mt-2 flex items-center font-bold">
                                <AlertTriangle size={12} className="mr-1"/> 
                                Thay đổi so với dự kiến: {(finalPrice - expense.giaDuKien).toLocaleString()}
                             </p>
                        )}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Người Duyệt</label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none"
                            value={approverName}
                            onChange={e => setApproverName(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {actionType === 'REJECT' && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Lý Do Từ Chối</label>
                        <textarea
                            rows={3}
                            placeholder="Nhập lý do..."
                            className="w-full bg-red-50 border border-red-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-red-500"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {actionType && (
                <button 
                    onClick={handleAction}
                    disabled={loading || (actionType === 'REJECT' && !rejectReason)}
                    className={`w-full mt-6 p-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                        actionType === 'APPROVE' 
                        ? 'bg-green-600 shadow-green-200 hover:bg-green-700' 
                        : 'bg-red-600 shadow-red-200 hover:bg-red-700 disabled:opacity-50'
                    }`}
                >
                    {loading ? 'Đang Xử Lý...' : 'Xác Nhận'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
