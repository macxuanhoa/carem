import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import SearchInput from './SearchInput';
import QuickFilters from '@/components/QuickFilters';
import ViewOptions from '@/components/ViewOptions';
import { formatCurrency, formatTimeAgo, formatStatus } from '@/lib/utils';
import CarListSkeleton from '@/components/skeletons/CarListSkeleton';

export const dynamic = 'force-dynamic';

const CAR_STATUS_GROUPS = [
    { label: 'Kho Xe (Đang bán)', statuses: ['TIM_THAY', 'DA_COC', 'DA_CHUYEN_TIEN', 'CHO_GIAO_XE', 'XE_DA_VE', 'DANG_BAN'] },
    { label: 'Đã Bán', statuses: ['DA_BAN'] },
    { label: 'Hủy / Treo', statuses: ['HUY_GIAO_DICH'] }
];

async function CarList({ sort, group, groupBy, query, status, model }: { sort: string, group: string, groupBy?: string, query?: string, status?: string, model?: string }) {
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { tongGiaMua: 'asc' };
    if (sort === 'price_desc') orderBy = { tongGiaMua: 'desc' };
    if (sort === 'date_asc') orderBy = { createdAt: 'asc' };
    if (sort === 'year_desc') orderBy = { namSanXuat: 'desc' };
    if (sort === 'year_asc') orderBy = { namSanXuat: 'asc' };

    let whereClause: any = {};
    
    // Status Quick Filter
    if (status === 'sold') whereClause.trangThai = { in: CAR_STATUS_GROUPS[1].statuses };
    else if (status === 'overdue') whereClause.hoSo = { trangThai: 'QUA_HAN' };
    else if (status === 'deposited') {
        whereClause.soTienCoc = { gt: 0 };
        whereClause.trangThai = { in: CAR_STATUS_GROUPS[0].statuses }; // Only active cars
    }
    else if (status === 'selling') {
         // Selling: Active Status AND (Marked as DANG_BAN OR Has Facebook Link) AND Not Deposited
         whereClause.trangThai = { in: CAR_STATUS_GROUPS[0].statuses };
         whereClause.soTienCoc = 0;
         whereClause.OR = [
             { trangThai: 'DANG_BAN' },
             { facebookLink: { not: '' } }
         ];
    }
    else if (status === 'all') {
        // All Inventory (Excluding Sold/Cancelled)
        whereClause.trangThai = { in: CAR_STATUS_GROUPS[0].statuses };
        // We include deposited cars in "All Inventory" for overview
    }
    else {
        // Default (No filter): Show All Inventory
         whereClause.trangThai = { in: CAR_STATUS_GROUPS[0].statuses };
    }

    // Search query
    if (query) {
        whereClause.OR = [
            { dongXe: { contains: query } },
            { bienSo: { contains: query } },
            { nguoiBan: { contains: query } }
        ];
    }

    // Model Filter (Exact match or contains if user selected from list)
    if (model) {
        whereClause.dongXe = { contains: model };
    }

    const cars = await prisma.xeMuaVao.findMany({
        where: whereClause,
        orderBy,
        include: { banRa: true, hoSo: true },
    });

    if (cars.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4 shadow-inner">
                    <Car size={40} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Chưa có xe nào trong danh mục này.</p>
                <Link href="/cars/new" className="mt-4 text-blue-600 dark:text-blue-400 font-bold hover:underline">Nhập xe ngay</Link>
            </div>
        );
    }

    // Grouping Logic
    if (groupBy && groupBy !== 'none') {
        const groups: Record<string, typeof cars> = {};
        
        cars.forEach(car => {
            let key = '';
            if (groupBy === 'status') key = car.trangThai;
            else if (groupBy === 'year') key = car.namSanXuat.toString();
            else key = 'Khác';

            if (!groups[key]) groups[key] = [];
            groups[key].push(car);
        });

        const sortedKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

        return (
            <div className="space-y-8 pb-4">
                {sortedKeys.map(key => (
                    <div key={key}>
                        <h2 className="font-bold text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center uppercase tracking-wider pl-1">
                            <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>
                            {groupBy === 'status' ? key : `Đời ${key}`}
                            <span className="ml-auto text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{groups[key].length} xe</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groups[key].map(car => <CarCard key={car.id} car={car} />)}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {cars.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
    );
}

function CarCard({ car }: { car: any }) {
    const isOverdue = car.hoSo?.trangThai === 'QUA_HAN';
    const isSold = car.trangThai === 'DA_BAN';
    const isDeposited = car.soTienCoc > 0 && !isSold;
    const isSelling = !isSold && !isDeposited && (car.trangThai === 'DANG_BAN' || !!car.facebookLink);
    
    // Parse Image
    let thumbnail = null;
    try {
        const images = JSON.parse(car.hinhAnh || '[]');
        if (images.length > 0) thumbnail = images[0];
    } catch (e) {
        // Ignore error
    }
    
    // Helper for status badge
    const getStatusBadge = () => {
        if (isSold) return { label: 'Đã Bán', color: 'bg-green-100 text-green-700 ring-1 ring-green-600/20' };
        if (isDeposited) return { label: 'Đã Cọc', color: 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20' };
        if (isOverdue) return { label: 'Quá Hạn', color: 'bg-red-100 text-red-700 ring-1 ring-red-600/20' };
        if (isSelling) return { label: 'Đang Bán', color: 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20' };
        return { label: formatStatus(car.trangThai), color: 'bg-gray-100 text-gray-600 ring-1 ring-gray-600/20' };
    };

    const status = getStatusBadge();
    
    return (
        <Link href={`/cars/${car.id}`} className="block group h-full">
            <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 relative overflow-hidden h-full flex flex-col
                group-hover:shadow-md group-hover:translate-y-[-2px] group-hover:border-blue-200 dark:group-hover:border-blue-800
                ${isOverdue ? 'ring-2 ring-red-500/50' : ''}
            `}>
                {/* Header Badge & Image */}
                <div className="relative aspect-4/3 bg-gray-100 dark:bg-gray-800">
                    {thumbnail ? (
                        <img 
                            src={thumbnail} 
                            alt={car.dongXe} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-700">
                            <Car size={48} strokeWidth={1.5} />
                            <span className="text-[10px] font-bold uppercase mt-2">Chưa có ảnh</span>
                        </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm backdrop-blur-md ${status.color}`}>
                            {status.label}
                        </span>
                    </div>

                    <div className="absolute top-3 right-3">
                        <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-white/20">
                            {formatTimeAgo(new Date(car.createdAt))}
                        </span>
                    </div>
                </div>

                {/* Main Info */}
                <div className="px-4 pt-4 mb-2 flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                        {car.dongXe}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                         <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700 font-medium">Đời {car.namSanXuat}</span>
                         <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">{car.mauXe}</span>
                         {car.bienSo && (
                             <span className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded-md border border-yellow-100 dark:border-yellow-900/30 font-mono font-medium">
                                {car.bienSo}
                             </span>
                         )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3 flex items-center">
                        <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-1.5"></span>
                        Nhập: {new Date(car.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                </div>

                {/* Footer: Price */}
                <div className="mt-auto bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 p-4 flex justify-between items-end">
                     <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5 tracking-wide">Giá vốn</p>
                        <p className="font-bold text-gray-900 dark:text-white text-xl tracking-tight">{car.tongGiaMua.toLocaleString()} <span className="text-xs font-normal text-gray-500">đ</span></p>
                     </div>
                     {car.soTienCoc > 0 && (
                         <div className="text-right">
                             <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Đã cọc</p>
                             <p className="font-bold text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-md border border-green-100 dark:border-green-900/30">
                                +{car.soTienCoc.toLocaleString()}
                             </p>
                         </div>
                     )}
                </div>

                {/* Overdue Warning Overlay */}
                {isOverdue && (
                    <div className="absolute top-0 right-0">
                        <div className="bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg shadow-sm">
                            HỒ SƠ QUÁ HẠN
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}

// Icon for empty state
function Car({ size, className, strokeWidth = 2 }: { size: number, className?: string, strokeWidth?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
        </svg>
    )
}

export default async function CarsPage({ searchParams }: { searchParams: Promise<{ sort?: string, group?: string, groupBy?: string, q?: string, status?: string, model?: string }> }) {
  const { sort, group, groupBy, q, status, model } = await searchParams;
  const currentSort = sort || 'date_desc'; // Default: Newest to Oldest
  const currentGroup = group || 'inventory';
  const currentGroupBy = groupBy || 'none';
  const currentQuery = q || '';
  const currentStatus = status || 'all';
  const currentModel = model || '';

  // Get dynamic model list for filter
  const distinctModels = await prisma.xeMuaVao.findMany({
      where: { 
        trangThai: { in: CAR_STATUS_GROUPS[0].statuses } // Only get models from inventory
      },
      select: { dongXe: true },
      distinct: ['dongXe'],
      orderBy: { dongXe: 'asc' }
  });

  const availableModels = distinctModels.map(item => item.dongXe).filter(Boolean);

  const getUrl = (key: string, value: string) => {
      const params = new URLSearchParams();
      params.set('group', currentGroup);
      params.set('sort', currentSort);
      params.set('groupBy', currentGroupBy);
      if (currentQuery) params.set('q', currentQuery);
      if (currentStatus) params.set('status', currentStatus);
      if (currentModel) params.set('model', currentModel);
      params.set(key, value);
      return `/cars?${params.toString()}`;
  };

  return (
    <div className="pb-20 md:pb-6 bg-gray-50 dark:bg-gray-950 min-h-screen font-sans">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl pt-safe-top px-4 pb-3 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-all">
        <div className="flex justify-between items-center mb-3 pt-2">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Kho Xe</h1>
            
            {/* Group By Dropdown - Moved to ViewOptions */}
            <ViewOptions models={availableModels} />
        </div>
        
        <SearchInput />
        <div className="mt-3 -mx-4 px-4 overflow-x-auto no-scrollbar pb-1">
            <QuickFilters />
        </div>
        
      </div>

      <div className="px-4 mt-4 pb-safe-bottom">
        <Suspense fallback={<CarListSkeleton />}>
            <CarList sort={currentSort} group={currentGroup} groupBy={currentGroupBy} query={currentQuery} status={currentStatus} model={currentModel} />
        </Suspense>
      </div>

      <Link href="/cars/new" className="md:hidden fixed bottom-24 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-300 hover:bg-blue-700 active:scale-90 transition-all z-50">
        <Plus size={28} strokeWidth={3} />
      </Link>
    </div>
  );
}
