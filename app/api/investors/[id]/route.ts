import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateInvestor } from '@/lib/services/investor.service';

// PUT: Cập nhật trạng thái hoặc thêm tiền đã nộp
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const investorId = parseInt(id);
  
  try {
    const body = await request.json();
    const { action, soTien, ghiChu, hinhAnh, trangThaiMoi } = body;

    const result = await updateInvestor({
        id: investorId,
        action,
        soTien,
        ghiChu,
        hinhAnh,
        trangThaiMoi
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update investor' }, { status: 500 });
  }
}
