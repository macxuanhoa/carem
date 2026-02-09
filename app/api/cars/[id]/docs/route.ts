import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateCarDocs } from '@/lib/services/car.service';

// PUT: Cập nhật trạng thái hồ sơ
export async function PUT(
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
    const { trangThai, noiGiuHoSo, ngayHenRut, nguoiChiuTrachNhiem } = body;

    const updated = await updateCarDocs(carId, {
        trangThai,
        noiGiuHoSo,
        ngayHenRut: ngayHenRut ? new Date(ngayHenRut) : null,
        nguoiChiuTrachNhiem
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update docs' }, { status: 500 });
  }
}
