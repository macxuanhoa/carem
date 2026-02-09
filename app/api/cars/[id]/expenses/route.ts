import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createExpense } from '@/lib/services/expense.service';

// POST: Tạo đề xuất chi phí mới (Mặc định: CHO_DUYET)
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
    const { loaiChiPhi, giaDuKien, nguoiBaoGia, ghiChu } = body;

    const expense = await createExpense({
        xeMuaVaoId: carId,
        loaiChiPhi,
        giaDuKien: Number(giaDuKien),
        giaThucTe: 0,
        nguoiBaoGia,
        ghiChu,
        trangThai: 'CHO_DUYET'
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
