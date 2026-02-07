import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Cập nhật trạng thái hoặc thêm tiền đã nộp
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const investorId = parseInt(id);
  
  try {
    const body = await request.json();
    const { action, soTien, ghiChu, hinhAnh, trangThaiMoi } = body;

    // 1. Nếu là nộp tiền thêm
    if (action === 'ADD_PAYMENT') {
        const payment = await prisma.lichSuGopVon.create({
            data: {
                xeGopDauTuId: investorId,
                soTien: Number(soTien),
                ghiChu,
                hinhAnh
            }
        });

        // Tự động cộng dồn vào bảng cha
        await prisma.xeGopDauTu.update({
            where: { id: investorId },
            data: {
                daGop: { increment: Number(soTien) }
            }
        });

        return NextResponse.json(payment);
    }

    // 2. Nếu là cập nhật trạng thái (vd: Tranh chấp, Tất toán)
    if (action === 'UPDATE_STATUS') {
        const updated = await prisma.xeGopDauTu.update({
            where: { id: investorId },
            data: { trangThai: trangThaiMoi }
        });
        return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update investor' }, { status: 500 });
  }
}
