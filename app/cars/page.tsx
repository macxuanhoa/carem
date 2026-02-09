import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Bike } from 'lucide-react';
import { Suspense } from 'react';
import SearchInput from './SearchInput';
import QuickFilters from '@/components/QuickFilters';
import ViewOptions from '@/components/ViewOptions';
import CarListSkeleton from '@/components/skeletons/CarListSkeleton';
import CarCard from '@/components/CarCard';
import { Button } from '@/components/ui/button';

const CAR_STATUS_GROUPS = [
    { label: 'Kho Xe (Đang bán)', statuses: ['TIM_THAY', 'DA_COC', 'DA_CHUYEN_TIEN', 'CHO_GIAO_XE', 'XE_DA_VE', 'DANG_BAN'] },
    { label: 'Đã Bán', statuses: ['DA_BAN'] },
    { label: 'Hủy / Treo', statuses: ['HUY_GIAO_DICH'] }
];

import { ChevronLeft, ChevronRight } from 'lucide-react';

async function CarList({ sort, group, groupBy, query, status, model, page = 1 }: { sort: string, group: string, groupBy?: string, query?: string, status?: string, model?: string, page?: number }) {
    const ITEMS_PER_PAGE = 20;
    const skip = (page - 1) * ITEMS_PER_PAGE;

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
        // All Inventory + Sold (Excluding Cancelled)
        whereClause.trangThai = { not: 'HUY_GIAO_DICH' };
    }
    else {
        // Default (No filter): Show All (Inventory + Sold)
         whereClause.trangThai = { not: 'HUY_GIAO_DICH' };
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

    // Parallel Fetching: Get Data + Total Count for Pagination
    const [cars, totalCount] = await Promise.all([
        prisma.xeMuaVao.findMany({
            where: whereClause,
            orderBy,
            include: { banRa: true, hoSo: true },
            skip,
            take: ITEMS_PER_PAGE,
        }),
        prisma.xeMuaVao.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    if (cars.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4 shadow-inner">
                    <Bike size={40} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Chưa có xe nào trong danh mục này.</p>
                <Button variant="link" asChild className="mt-2 text-blue-600 dark:text-blue-400 font-bold">
                    <Link href="/cars/new">Nhập xe ngay</Link>
                </Button>
            </div>
        );
    }

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const createPageUrl = (newPage: number) => {
            const params = new URLSearchParams();
            if (sort) params.set('sort', sort);
            if (group) params.set('group', group);
            if (groupBy) params.set('groupBy', groupBy);
            if (query) params.set('q', query);
            if (status) params.set('status', status);
            if (model) params.set('model', model);
            params.set('page', newPage.toString());
            return `/cars?${params.toString()}`;
        };

        return (
            <div className="flex justify-center items-center gap-4 mt-8 pb-8">
                <Button
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    className="rounded-full shadow-sm"
                    asChild={page > 1}
                >
                    {page > 1 ? (
                        <Link href={createPageUrl(page - 1)}>
                            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                        </Link>
                    ) : (
                         <ChevronLeft size={20} className="text-gray-300 dark:text-gray-600" />
                    )}
                </Button>
                
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                    Trang {page} / {totalPages}
                </span>

                <Button
                    variant="outline"
                    size="icon"
                    disabled={page >= totalPages}
                    className="rounded-full shadow-sm"
                    asChild={page < totalPages}
                >
                    {page < totalPages ? (
                        <Link href={createPageUrl(page + 1)}>
                            <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                        </Link>
                    ) : (
                        <ChevronRight size={20} className="text-gray-300 dark:text-gray-600" />
                    )}
                </Button>
            </div>
        );
    };

    // Grouping Logic (Client-side grouping of the CURRENT PAGE only - Limitation of mixing pagination + grouping)
    // Note: True grouping with pagination requires complex SQL. For now, we group the fetched page.
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
                {renderPagination()}
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {cars.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
            {renderPagination()}
        </div>
    );
}

export default async function CarsPage({ searchParams }: { searchParams: Promise<{ sort?: string, group?: string, groupBy?: string, q?: string, status?: string, model?: string, page?: string }> }) {
  const { sort, group, groupBy, q, status, model, page } = await searchParams;
  const currentSort = sort || 'date_desc'; // Default: Newest to Oldest
  const currentGroup = group || 'inventory';
  const currentGroupBy = groupBy || 'none';
  const currentQuery = q || '';
  const currentStatus = status || 'all';
  const currentModel = model || '';
  const currentPage = parseInt(page || '1', 10);

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
            <Button asChild className="hidden md:flex gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm ml-4">
                <Link href="/cars/new">
                    <Plus size={18} strokeWidth={2.5} />
                    Nhập Xe
                </Link>
            </Button>
        </div>
        
        <SearchInput />
        <div className="mt-3 -mx-4 px-4 overflow-x-auto no-scrollbar pb-1">
            <QuickFilters />
        </div>
        
      </div>

      <div className="px-4 mt-4 pb-safe-bottom">
        <Suspense fallback={<CarListSkeleton />}>
            <CarList sort={currentSort} group={currentGroup} groupBy={currentGroupBy} query={currentQuery} status={currentStatus} model={currentModel} page={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}
