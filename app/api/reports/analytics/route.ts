import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCarAnalytics } from '@/lib/services/car.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await getCarAnalytics();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
