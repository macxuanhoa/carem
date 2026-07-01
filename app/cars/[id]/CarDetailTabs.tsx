'use client';

import { useState, Suspense, lazy } from 'react';
import { DealTimelineProps } from './tabs/types';
const InfoTab = lazy(() => import('./tabs/InfoTab'));
const FinanceTab = lazy(() => import('./tabs/FinanceTab'));
const RecordsTab = lazy(() => import('./tabs/RecordsTab'));

// Deal Timeline Component
function DealTimeline({ status, deposit, isSold }: DealTimelineProps) {
    const steps = [
        { label: 'Nhập Xe', active: true },
        { label: 'Sẵn Sàng', active: status !== 'TIM_THAY' },
        { label: 'Có Cọc', active: deposit > 0 || isSold },
        { label: 'Đã Bán', active: isSold }
    ];

    return (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm px-4 py-4 shadow-sm border-b border-slate-100 dark:border-white/5">
             <div className="flex items-center justify-between relative max-w-sm mx-auto">
                <div className="absolute left-0 top-[11px] w-full h-1 bg-slate-100 dark:bg-white/20 z-0 rounded-full"></div>
                <div className="absolute left-0 top-[11px] h-1 bg-violet-500 z-0 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-violet-500/50"
                     style={{ 
                         width: isSold ? '100%' : deposit > 0 ? '66%' : status !== 'TIM_THAY' ? '33%' : '0%' 
                     }}
                ></div>

                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center relative z-10">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white dark:bg-slate-900 ${
                            step.active 
                            ? 'border-violet-500 scale-110 shadow-lg shadow-violet-500/30' 
                            : 'border-slate-200 dark:border-slate-600'
                        }`}>
                            {step.active && <div className="w-2.5 h-2.5 bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>}
                        </div>
                        <span className={`text-[9px] font-bold mt-1.5 uppercase tracking-wide ${
                            step.active ? 'text-violet-400' : 'text-slate-500'
                        }`}>
                            {step.label}
                        </span>
                    </div>
                ))}
             </div>
        </div>
    );
}

import { CarWithRelations } from "@/lib/types";

interface CarDetailTabsProps {
    car: CarWithRelations;
    totalGop: number;
    totalChiPhi: number;
    isOverdue: boolean;
    userRole: string;
}

export default function CarDetailTabs({ car, totalGop, totalChiPhi, isOverdue, userRole }: CarDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
      { id: 'info', label: 'Thông tin' },
      // Only show Finance tab if Admin
      ...(userRole === 'ADMIN' ? [{ id: 'finance', label: 'Tài chính' }] : []),
      { id: 'records', label: 'Hồ sơ' }
  ];

  return (
    <div className="bg-background min-h-screen font-sans pb-20">
        <DealTimeline status={car.trangThai} deposit={car.soTienCoc} isSold={car.trangThai === 'DA_BAN'} />

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-[57px] z-20 shadow-sm">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                        activeTab === tab.id 
                        ? 'border-violet-600 text-violet-600 dark:text-violet-500' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'info' && (
                <Suspense fallback={<div className="p-8 text-center text-slate-500">Đang tải...</div>}>
                    <InfoTab car={car} isOverdue={isOverdue} userRole={userRole} />
                </Suspense>
            )}
            {activeTab === 'finance' && (
                <Suspense fallback={<div className="p-8 text-center text-slate-500">Đang tải...</div>}>
                    <FinanceTab car={car} totalGop={totalGop} totalChiPhi={totalChiPhi} />
                </Suspense>
            )}
            {activeTab === 'records' && (
                <Suspense fallback={<div className="p-8 text-center text-slate-500">Đang tải...</div>}>
                    <RecordsTab car={car} isOverdue={isOverdue} />
                </Suspense>
            )}
        </div>
    </div>
  );
}
