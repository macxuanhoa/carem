import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ExpensesClient from './ExpensesClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CarExpensesPage({ params }: PageProps) {
    const resolvedParams = await params;
    const carId = parseInt(resolvedParams.id);

    if (isNaN(carId)) {
        return notFound();
    }

    const car = await prisma.xeMuaVao.findUnique({
        where: { id: carId },
        include: {
            banRa: true,
            hoSo: true,
            gopVon: true,
            chiPhi: {
                orderBy: { createdAt: 'desc' }
            },
            lichSu: true
        }
    });

    if (!car) {
        return notFound();
    }

    return <ExpensesClient car={car} />;
}