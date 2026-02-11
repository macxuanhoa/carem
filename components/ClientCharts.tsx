"use client";

import dynamic from 'next/dynamic';

export const ROIChart = dynamic(() => import('@/components/ROIChart'), { 
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
});

export const CashFlowChart = dynamic(() => import('@/components/CashFlowChart'), { 
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
});

export const GrowthChart = dynamic(() => import('@/components/GrowthChart'), { 
    ssr: false,
    loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
});
