import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';

// PUT: Cập nhật trạng thái hồ sơ
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const carId = parseInt(id);
  
  try {
    const body = await request.json();
    const { trangThai, noiGiuHoSo, ngayHenRut, nguoiChiuTrachNhiem } = body;

    const updated = await prisma.hoSoXe.upsert({
      where: { xeMuaVaoId: carId },
      update: {
        trangThai,
        noiGiuHoSo,
        ngayHenRut: ngayHenRut ? new Date(ngayHenRut) : null,
        nguoiChiuTrachNhiem
      },
      create: {
        xeMuaVaoId: carId,
        trangThai: trangThai || 'CHUA_CAN',
        noiGiuHoSo: noiGiuHoSo || 'CHU_CU',
        ngayHenRut: ngayHenRut ? new Date(ngayHenRut) : null,
        nguoiChiuTrachNhiem
      }
    });

    await logAudit(
        carId,
        'System',
        'UPDATE_DOCS',
        `Cập nhật hồ sơ: ${trangThai} - Giữ tại: ${noiGiuHoSo}`
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update docs' }, { status: 500 });
  }
}
