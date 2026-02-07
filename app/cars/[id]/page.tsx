import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import CarDetailTabs from './CarDetailTabs';
import CarHeaderActions from './CarHeaderActions';

export const dynamic = 'force-dynamic';

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.xeMuaVao.findUnique({
    where: { id: parseInt(id) },
    include: {
      hoSo: true,
      banRa: true,
      chiPhi: true,
      gopVon: {
          include: { lichSuThanhToan: true }
      },
      lichSu: {
          orderBy: { createdAt: 'desc' },
          take: 5
      }
    }
  });

  if (!car) notFound();

  const totalGop = car.gopVon.reduce((sum, g) => sum + g.soTienGop, 0);
  const totalChiPhi = car.chiPhi.reduce((sum, c) => sum + c.giaThucTe, 0);
  const isOverdue = car.hoSo?.trangThai === 'QUA_HAN';

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* 1. Navbar / Header */}
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-30 px-4 py-3 shadow-sm flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
         <Link href="/cars" className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft size={20} />
         </Link>
         <h1 className="font-bold text-lg text-gray-800 dark:text-white truncate max-w-[200px]">{car.dongXe}</h1>
         <CarHeaderActions id={car.id} />
      </div>

      <CarDetailTabs 
        car={car} 
        totalGop={totalGop} 
        totalChiPhi={totalChiPhi} 
        isOverdue={isOverdue} 
      />
    </div>
  );
}
