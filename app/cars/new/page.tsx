'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle } from 'lucide-react';
import CarForm from '@/components/CarForm';
import { type CarFormData } from '@/lib/schemas';
import { createCar } from '@/app/actions';

export default function NewCarPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Prompt states
    const [showDocsPrompt, setShowDocsPrompt] = useState(false);
    const [showDraftPrompt, setShowDraftPrompt] = useState(false);
    const [pendingDraftData, setPendingDraftData] = useState<Partial<CarFormData> | null>(null);
    const [formDefaultValues, setFormDefaultValues] = useState<Partial<CarFormData>>({});

    useEffect(() => {
        // Check for draft
        const draft = localStorage.getItem('car_draft');
        if (draft) {
            try {
                const data = JSON.parse(draft);
                setPendingDraftData(data);
                setShowDraftPrompt(true);
            } catch (e) {
                console.error("Failed to parse draft", e);
            }
        }
    }, []);

    const handleFormChange = (data: CarFormData) => {
        // Save draft (exclude heavy image data if possible, but here we save all for simplicity)
        // Optimization: Don't save if empty
        if (data.dongXe) {
            // Exclude images from draft to save space if needed, or keep them
            const { hinhAnh, ...draftData } = data; 
            localStorage.setItem('car_draft', JSON.stringify(draftData));
        }
    };

    const handleSaveCar = async (data: CarFormData) => {
        setLoading(true);
        try {
            const result = await createCar(data);

            if (!result.success) {
                throw new Error(result.error || 'Failed to save car');
            }
            
            // Clear draft
            localStorage.removeItem('car_draft');
            
            setLoading(false);
            setShowDocsPrompt(true);
        } catch (error) {
            console.error(error);
            alert('Lỗi khi lưu xe: ' + (error as Error).message);
            setLoading(false);
        }
    };

    const handleRestoreDraft = () => {
        if (pendingDraftData) {
            setFormDefaultValues(pendingDraftData);
            setShowDraftPrompt(false);
        }
    };

    const handleDiscardDraft = () => {
        setShowDraftPrompt(false);
        localStorage.removeItem('car_draft');
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 block">
            <div className="p-5 max-w-lg mx-auto">
                <CarForm 
                    mode="create"
                    defaultValues={formDefaultValues}
                    onSubmit={handleSaveCar}
                    loading={loading}
                    onValuesChange={handleFormChange}
                />
            </div>

            {/* Success Prompt Modal */}
            <AnimatePresence>
                {showDocsPrompt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mx-auto mb-4">
                                <CheckCircle size={24} className="text-emerald-600 dark:text-emerald-500" />
                            </div>
                            
                            <h3 className="text-lg font-bold text-center text-slate-900 dark:text-white mb-2">Đã Lưu Xe Thành Công!</h3>
                            <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
                                Xe đã được thêm vào danh sách. Bạn có muốn xem chi tiết ngay không?
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => {
                                        router.push('/cars');
                                        router.refresh();
                                    }}
                                    className="w-full px-4 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200 dark:shadow-violet-900/30 transition-colors"
                                >
                                    Về Danh Sách Xe
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Draft Prompt Modal */}
            <AnimatePresence>
                {showDraftPrompt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex items-center justify-center w-12 h-12 bg-violet-100 dark:bg-violet-900/20 rounded-full mx-auto mb-4">
                                <FileText size={24} className="text-violet-600 dark:text-violet-500" />
                            </div>
                            
                            <h3 className="text-lg font-bold text-center text-slate-900 dark:text-white mb-2">Phát Hiện Bản Nháp Cũ</h3>
                            <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
                                Bạn có muốn khôi phục dữ liệu xe <strong>{pendingDraftData?.dongXe || 'Chưa đặt tên'}</strong> đang nhập dở không?
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={handleRestoreDraft}
                                    className="w-full px-4 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200 dark:shadow-violet-900/30 transition-colors"
                                >
                                    Khôi Phục Bản Nháp
                                </button>
                                <button 
                                    onClick={handleDiscardDraft}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-rose-500 dark:text-rose-400 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Hủy Bỏ, Tạo Mới
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
