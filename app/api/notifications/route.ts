import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const notifications = await prisma.lichSuThayDoi.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        xeMuaVao: {
          select: {
            bienSo: true,
            dongXe: true,
            mauXe: true
          }
        }
      }
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}