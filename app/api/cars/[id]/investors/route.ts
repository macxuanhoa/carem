import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';

// POST: Thêm nhà đầu tư mới vào xe
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const carId = parseInt(id);
  
  try {
    const body = await request.json();
    const { nguoiGop, tyLeGop, soTienGop, giayToLienQuan } = body;

    const investor = await prisma.xeGopDauTu.create({
      data: {
        xeMuaVaoId: carId,
        nguoiGop,
        tyLeGop: Number(tyLeGop),
        soTienGop: Number(soTienGop),
        giayToLienQuan,
        trangThai: 'DANG_GOP'
      }
    });

    await logAudit(
        carId,
        'System',
        'ADD_INVESTOR',
        `Thêm NĐT ${nguoiGop} - Tỷ lệ ${tyLeGop}% - Cam kết góp ${Number(soTienGop).toLocaleString()}`
    );

    return NextResponse.json(investor);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add investor' }, { status: 500 });
  }
}
