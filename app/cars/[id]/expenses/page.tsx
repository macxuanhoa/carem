'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Wrench, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Expense {
    id: number;
    loaiChiPhi: string;
    giaThucTe: number;
    ghiChu: string;
    createdAt: string;
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CarExpensesPage({ params }: PageProps) {
    // Unwrap params using React.use() or await in async component
    // Since this is a Client Component, we need to handle the Promise properly
    // However, Next.js 15 allows async params in Page components even if 'use client'
    // But to be safe and follow patterns, let's assume we get the ID.
    // Actually, for Client Components, it's better to pass ID as prop or use `useParams`.
    // Let's refactor this to be a Server Component that passes data to Client Component, 
    // OR use `useParams` hook.
    
    // REFACTOR STRATEGY: 
    // This file will be the Server Component wrapper (page.tsx)
    // We will create a client component for the logic.
    return <ExpenseManager params={params} />;
}

// Client Component
function ExpenseManager({ params }: { params: Promise<{ id: string }> }) {
    // Need to handle async params in Next.js 15
    const [carId, setCarId] = useState<string>('');
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    // Fetch data
    const [formData, setFormData] = useState({
        loaiChiPhi: 'Sửa chữa chung',
        giaThucTe: '',
        ghiChu: ''
    });

    // Resolve params
    useState(() => {
        params.then(p => {
            setCarId(p.id);
            fetchExpenses(p.id);
        });
    });

    const fetchExpenses = async (id: string) => {
        try {
            const res = await fetch(`/api/expenses?carId=${id}`);
            const data = await res.json();
            setExpenses(data);
        } catch (error) {
            toast.error('Lỗi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.giaThucTe) return toast.error('Vui lòng nhập số tiền');

        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    xeMuaVaoId: carId,
                    loaiChiPhi: formData.loaiChiPhi,
                    giaDuKien: parseInt(formData.giaThucTe.replace(/\./g, '')),
                    giaThucTe: parseInt(formData.giaThucTe.replace(/\./g, '')),
                    nguoiBaoGia: 'Admin', // Hardcode for now
                    ghiChu: formData.ghiChu
                })
            });

            if (!res.ok) throw new Error('Failed');

            toast.success('Đã thêm chi phí');
            setShowForm(false);
            setFormData({ loaiChiPhi: 'Sửa chữa chung', giaThucTe: '', ghiChu: '' });
            fetchExpenses(carId);
            router.refresh(); // Refresh server stats if needed
        } catch (error) {
            toast.error('Lỗi thêm chi phí');
        }
    };

    const handleDelete = async (expenseId: number) => {
        if (!confirm('Bạn có chắc muốn xóa khoản này?')) return;
        try {
            await fetch(`/api/expenses/${expenseId}`, { method: 'DELETE' });
            toast.success('Đã xóa');
            fetchExpenses(carId);
        } catch (error) {
            toast.error('Lỗi xóa');
        }
    };

    const formatMoneyInput = (value: string) => {
        const number = value.replace(/\D/g, '');
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const totalExpense = expenses.reduce((sum, e) => sum + e.giaThucTe, 0);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner /></div>;

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 sticky top-0 z-30 px-4 py-3 shadow-sm border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href={`/cars/${carId}`} className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="font-bold text-lg text-gray-800 dark:text-white ml-2">Chi Phí Sửa Chữa</h1>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Tổng chi</p>
                    <p className="text-orange-600 font-bold text-sm">{formatCurrency(totalExpense)}</p>
                </div>
            </div>

            <div className="p-4 max-w-lg mx-auto">
                {/* Add Button */}
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30 flex items-center justify-center mb-6 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} className="mr-2" /> Thêm Khoản Chi Mới
                    </button>
                )}

                {/* Form */}
                {showForm && (
                    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 animate-in fade-in slide-in-from-top-4">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                            <Wrench size={18} className="mr-2 text-blue-600" /> Nhập chi phí
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Loại chi phí</label>
                                <select 
                                    value={formData.loaiChiPhi}
                                    onChange={(e) => setFormData({...formData, loaiChiPhi: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 font-medium outline-none focus:border-blue-600 dark:text-white"
                                >
                                    <option>Sửa chữa chung</option>
                                    <option>Sơn / Gò hàn</option>
                                    <option>Thay dầu / Bảo dưỡng</option>
                                    <option>Rửa xe / Dọn nội thất</option>
                                    <option>Hoa hồng môi giới</option>
                                    <option>Phí hồ sơ / Công chứng</option>
                                    <option>Khác</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Số tiền (VNĐ)</label>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        inputMode="numeric"
                                        value={formData.giaThucTe}
                                        onChange={(e) => setFormData({...formData, giaThucTe: formatMoneyInput(e.target.value)})}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 pl-10 font-bold text-lg outline-none focus:border-blue-600 dark:text-white"
                                        placeholder="0"
                                        autoFocus
                                    />
                                    <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Ghi chú (Tùy chọn)</label>
                                <input 
                                    type="text"
                                    value={formData.ghiChu}
                                    onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:border-blue-600 dark:text-white"
                                    placeholder="Chi tiết..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* List */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-xs uppercase pl-1">Lịch sử chi tiêu</h3>
                    {expenses.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 dark:text-gray-600">
                            <Wrench size={40} className="mx-auto mb-3 opacity-20" />
                            <p>Chưa có khoản chi nào</p>
                        </div>
                    ) : (
                        expenses.map(expense => (
                            <div key={expense.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center group">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white text-sm">{expense.loaiChiPhi}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{expense.ghiChu || 'Không có ghi chú'}</p>
                                    <p className="text-[10px] text-gray-400 mt-1 flex items-center">
                                        <Calendar size={10} className="mr-1" />
                                        {new Date(expense.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-orange-600 dark:text-orange-500">{formatCurrency(expense.giaThucTe)}</p>
                                    <button 
                                        onClick={() => handleDelete(expense.id)}
                                        className="text-red-400 p-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}