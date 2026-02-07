import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegramNotification } from '@/lib/telegram';

// POST: Tạo đề xuất chi phí mới (Mặc định: CHO_DUYET)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const carId = parseInt(id);
  
  try {
    const body = await request.json();
    const { loaiChiPhi, giaDuKien, nguoiBaoGia, ghiChu } = body;

    const expense = await prisma.chiPhiXe.create({
      data: {
        xeMuaVaoId: carId,
        loaiChiPhi,
        giaDuKien: Number(giaDuKien),
        giaThucTe: 0, // Chưa duyệt nên chưa có giá thực
        nguoiBaoGia,
        ghiChu,
        trangThai: 'CHO_DUYET'
      },
      include: {
        xeMuaVao: true
      }
    });

    // Notify Telegram
    const message = `
⚠️ <b>DUYỆT CHI PHÍ MỚI</b>
-------------------------
Xe: <b>${expense.xeMuaVao?.dongXe}</b>
Biển số: ${expense.xeMuaVao?.bienSo}
-------------------------
📝 <b>Nội dung:</b> ${expense.loaiChiPhi}
💰 <b>Số tiền:</b> ${expense.giaDuKien.toLocaleString()} đ
👤 <b>Người báo:</b> ${expense.nguoiBaoGia}
-------------------------
<i>Vui lòng vào app để duyệt!</i>
`;
    await sendTelegramNotification(message);

    return NextResponse.json(expense);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
