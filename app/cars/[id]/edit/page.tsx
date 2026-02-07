import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditCarForm from './EditCarForm';

export const dynamic = 'force-dynamic';

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.xeMuaVao.findUnique({
    where: { id: parseInt(id) }
  });

  if (!car) notFound();

  return <EditCarForm car={car} />;
}
