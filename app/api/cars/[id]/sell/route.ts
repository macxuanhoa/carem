import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sellCar } from '@/lib/services/car.service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const carId = parseInt(id);
  
  try {
    const body = await request.json();
    const { giaBan, khachMua, daThuDuTien, daGiaoXe } = body;

    const result = await sellCar({
        carId,
        giaBan: Number(giaBan),
        khachMua,
        daThuDuTien,
        daGiaoXe,
        nguoiThucHien: session.user.name || 'Admin'
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    const message = (error as Error).message;
    // Simple way to detect business errors vs server errors
    if (message.includes('KHÔNG THỂ BÁN') || message.includes('hợp lệ')) {
        return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create sell record' }, { status: 500 });
  }
}
