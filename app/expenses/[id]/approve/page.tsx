import { prisma } from '@/lib/prisma';
import ApproveClient from './ApproveClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ApproveExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const expense = await prisma.chiPhiXe.findUnique({
    where: { id: parseInt(id) },
    include: { xeMuaVao: true }
  });

  if (!expense) notFound();

  return <ApproveClient expense={expense} />;
}
