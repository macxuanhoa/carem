'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Layers, Check, ArrowDownUp, ArrowUp, ArrowDown, Calendar, Grid, List, Filter, X, Search } from 'lucide-react';
import { MOTORBIKE_MODELS } from '@/lib/constants';

import ExcelExport from './ExcelExport';

export default function ViewOptions({ models = [] }: { models?: string[] }) {
  // ... existing code ...
  
  return (
    <div className="flex gap-2">
      <ExcelExport data={[]} /> {/* Placeholder data, ideally pass filtered data here */}
      
      <div className="relative group z-50">
        <button className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 shadow-sm active:bg-gray-50 dark:active:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
            <Layers size={20} />
        </button>
        
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 hidden group-hover:block group-focus-within:block z-9999 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            
            {/* Sort Section */}
            <div className="mb-2">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">Thời gian</p>
                <div className="space-y-1">
                    <Link href={createUrl('sort', 'date_desc')} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${currentSort === 'date_desc' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <div className="flex items-center"><Calendar size={16} className="mr-3 text-gray-400 dark:text-gray-500"/> Mới nhập về</div>
                        {currentSort === 'date_desc' && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                    </Link>
                    <Link href={createUrl('sort', 'date_asc')} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${currentSort === 'date_asc' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <div className="flex items-center"><Calendar size={16} className="mr-3 text-gray-400 dark:text-gray-500"/> Cũ nhất</div>
                        {currentSort === 'date_asc' && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                    </Link>
                </div>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>

            {/* Price Section */}
            <div className="mb-2">
                 <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">Giá bán</p>
                 <div className="space-y-1">
                    <Link href={createUrl('sort', 'price_asc')} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${currentSort === 'price_asc' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                         <div className="flex items-center"><ArrowUp size={16} className="mr-3 text-gray-400 dark:text-gray-500"/> Giá tăng dần</div>
                         {currentSort === 'price_asc' && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                    </Link>
                    <Link href={createUrl('sort', 'price_desc')} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${currentSort === 'price_desc' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                         <div className="flex items-center"><ArrowDown size={16} className="mr-3 text-gray-400 dark:text-gray-500"/> Giá giảm dần</div>
                         {currentSort === 'price_desc' && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                    </Link>
                </div>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>

            {/* Model Filter Section */}
            <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">Lọc Dòng Xe</p>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                     <button 
                        onClick={() => setIsModelModalOpen(true)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
                     >
                        <span className="truncate font-medium">
                            {currentModel ? currentModel : 'Chọn dòng xe...'}
                        </span>
                        <Filter size={14} className="text-gray-400 dark:text-gray-500" />
                     </button>
                     
                     {currentModel && (
                        <button 
                            onClick={() => router.push(createUrl('model', 'all'))}
                            className="w-full text-center text-[10px] text-red-500 dark:text-red-400 font-bold mt-2 hover:underline"
                        >
                            Xóa bộ lọc
                        </button>
                     )}
                </div>
            </div>
        </div>
      </div>
  );
}
        <button className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 shadow-sm active:bg-gray-50 dark:active:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
            <Layers size={20} />
        </button>
        
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 hidden group-hover:block group-focus-within:block z-9999 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            
            {/* Sort Section */}
            <div className="mb-2">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">Thời gian</p>
                <div className="space-y-1">
                    <Link href={createUrl('sort', 'date_desc')} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${currentSort === 'date_desc' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <div className="flex items-center"><Calendar size={16} className="mr-3 text-gray-400 dark:text-gray-500"/> Mới nhập về</div>
                        {currentSort === 'date_desc' && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                    </Link>
                    <Link href={createUrl('sort', 'date_asc')} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${currentSort === 'date_asc' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <div className="flex items-center"><Calendar size={16} className="mr-3 text-gray-400 dark:text-gray-500"/> Cũ nhất</div>
                        {currentSort === 'date_asc' && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                    </Link>
                </div>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>

            {/* Price Section */}
            <div className="mb-2">
                 <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">Giá bán</p>
                 <div className="space-y-1">
                    <Link href={createUrl('sort', 'price_asc')} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${currentSort === 'price_asc' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                         <div className="flex items-center"><ArrowUp size={16} className="mr-3 text-gray-400 dark:text-gray-500"/> Giá tăng dần</div>
                         {currentSort === 'price_asc' && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                    </Link>
                    <Link href={createUrl('sort', 'price_desc')} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${currentSort === 'price_desc' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                         <div className="flex items-center"><ArrowDown size={16} className="mr-3 text-gray-400 dark:text-gray-500"/> Giá giảm dần</div>
                         {currentSort === 'price_desc' && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                    </Link>
                </div>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>

            {/* Model Filter Section */}
            <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">Lọc Dòng Xe</p>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                     <button 
                        onClick={() => setIsModelModalOpen(true)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
                     >
                        <span className="truncate font-medium">
                            {currentModel ? currentModel : 'Chọn dòng xe...'}
                        </span>
                        <Filter size={14} className="text-gray-400 dark:text-gray-500" />
                     </button>
                     
                     {currentModel && (
                        <button 
                            onClick={() => router.push(createUrl('model', 'all'))}
                            className="w-full text-center text-[10px] text-red-500 dark:text-red-400 font-bold mt-2 hover:underline"
                        >
                            Xóa bộ lọc
                        </button>
                     )}
                </div>
            </div>
        </div>
    </div>

    {/* Model Selection Modal - Portaled to Body */}
    {mounted && isModelModalOpen && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Modal Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 shrink-0">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">Chọn Dòng Xe</h3>
                    <button 
                        onClick={() => setIsModelModalOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shrink-0">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm nhanh..." 
                            value={modelSearch}
                            onChange={(e) => setModelSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-400 dark:focus:border-blue-600 outline-none transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Models Grid */}
                <div className="p-4 overflow-y-auto flex-1 min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <button
                            onClick={() => handleSelectModel('all')}
                            className={`p-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-between
                                ${!currentModel 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 dark:shadow-blue-900/30' 
                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                }
                            `}
                        >
                            <span>Tất cả xe</span>
                            {!currentModel && <Check size={16} />}
                        </button>

                        {filteredModels.map((model) => (
                            <button
                                key={model}
                                onClick={() => handleSelectModel(model)}
                                className={`p-3 rounded-xl text-sm font-medium border transition-all flex items-center justify-between text-left
                                    ${currentModel === model 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 dark:shadow-blue-900/30' 
                                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                    }
                                `}
                            >
                                <span className="truncate pr-2">{model}</span>
                                {currentModel === model && <Check size={16} className="shrink-0" />}
                            </button>
                        ))}
                        
                        {filteredModels.length === 0 && (
                            <div className="col-span-full py-8 text-center text-gray-400 dark:text-gray-500">
                                Không tìm thấy dòng xe nào phù hợp.
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-center shrink-0">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Hiển thị {filteredModels.length} dòng xe đang có trong kho</p>
                </div>
            </div>
        </div>,
        document.body
    )}
    </>
  );
}
