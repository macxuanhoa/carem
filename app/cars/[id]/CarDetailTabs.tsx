'use client';

import { useState } from 'react';
import { DealTimelineProps } from './tabs/types';
import InfoTab from './tabs/InfoTab';
import FinanceTab from './tabs/FinanceTab';
import RecordsTab from './tabs/RecordsTab';

// Deal Timeline Component
function DealTimeline({ status, deposit, isSold }: DealTimelineProps) {
    const steps = [
        { label: 'Nhập Xe', active: true },
        { label: 'Sẵn Sàng', active: status !== 'TIM_THAY' },
        { label: 'Có Cọc', active: deposit > 0 || isSold },
        { label: 'Đã Bán', active: isSold }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 px-4 py-4 shadow-sm border-b border-gray-100 dark:border-gray-800">
             <div className="flex items-center justify-between relative max-w-sm mx-auto">
                <div className="absolute left-0 top-[11px] w-full h-1 bg-gray-100 dark:bg-gray-800 z-0 rounded-full"></div>
                <div className="absolute left-0 top-[11px] h-1 bg-green-500 z-0 rounded-full transition-all duration-1000 ease-out shadow-sm"
                     style={{ 
                         width: isSold ? '100%' : deposit > 0 ? '66%' : status !== 'TIM_THAY' ? '33%' : '0%' 
                     }}
                ></div>

                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center relative z-10">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white dark:bg-gray-900 ${
                            step.active 
                            ? 'border-green-500 scale-110' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}>
                            {step.active && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
                        </div>
                        <span className={`text-[9px] font-bold mt-1.5 uppercase tracking-wide ${
                            step.active ? 'text-green-600 dark:text-green-500' : 'text-gray-300 dark:text-gray-600'
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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen font-sans pb-20">
        <DealTimeline status={car.trangThai} deposit={car.soTienCoc} isSold={car.trangThai === 'DA_BAN'} />

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-[57px] z-20 shadow-sm">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                        activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'info' && <InfoTab car={car} isOverdue={isOverdue} userRole={userRole} />}
            {activeTab === 'finance' && <FinanceTab car={car} totalGop={totalGop} totalChiPhi={totalChiPhi} />}
            {activeTab === 'records' && <RecordsTab car={car} isOverdue={isOverdue} />}
        </div>
    </div>
  );
}
