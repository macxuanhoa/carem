import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import CarDetailTabs from './CarDetailTabs';
import CarHeaderActions from './CarHeaderActions';
import { auth } from '@/auth';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const car = await prisma.xeMuaVao.findUnique({
    where: { id: parseInt(id) },
    select: { dongXe: true, bienSo: true }
  });

  if (!car) {
    return {
      title: 'Không tìm thấy xe',
    };
  }

  return {
    title: `${car.dongXe} - ${car.bienSo || 'Chưa biển'} | Quản lý xe`,
    description: `Chi tiết xe ${car.dongXe} biển số ${car.bienSo}`,
  };
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userRole = (session?.user as any)?.role || 'STAFF'; // Default to STAFF if not found

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
    <div className="bg-slate-950 min-h-screen pb-safe-bottom">
      {/* 1. Navbar / Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30 px-4 py-3 shadow-sm flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 transition-all duration-300">
         <Link href="/cars" className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
         </Link>
         <h1 className="font-bold text-lg text-slate-800 dark:text-white truncate max-w-[200px]">{car.dongXe}</h1>
         <CarHeaderActions id={car.id} />
      </div>

      <CarDetailTabs 
        car={car} 
        totalGop={totalGop} 
        totalChiPhi={totalChiPhi} 
        isOverdue={isOverdue}
        userRole={userRole}
      />
    </div>
  );
}
