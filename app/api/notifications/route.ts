import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getNotifications } from '@/lib/services/car.service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  
  // Safe parsing for pagination parameters
  const limitParam = parseInt(searchParams.get('limit') || '20');
  const pageParam = parseInt(searchParams.get('page') || '1');
  
  const limit = (isNaN(limitParam) || limitParam < 1) ? 20 : limitParam;
  const page = (isNaN(pageParam) || pageParam < 1) ? 1 : pageParam;

  try {
    const notifications = await getNotifications(limit, page);
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}