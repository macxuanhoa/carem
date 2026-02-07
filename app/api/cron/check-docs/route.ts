import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegramNotification } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);

    // Tìm các hồ sơ sắp hết hạn trong 3 ngày tới hoặc đã quá hạn
    const overdueDocs = await prisma.hoSoXe.findMany({
      where: {
        trangThai: { not: 'DA_RUT' },
        ngayHenRut: {
          lte: threeDaysLater, // Deadline <= 3 ngày tới
        }
      },
      include: {
        xeMuaVao: true
      }
    });

    if (overdueDocs.length === 0) {
      return NextResponse.json({ message: 'No overdue docs' });
    }

    let message = `🚨 <b>CẢNH BÁO HỒ SƠ XE</b> (${overdueDocs.length} xe)\n`;
    
    for (const doc of overdueDocs) {
      const deadline = doc.ngayHenRut ? new Date(doc.ngayHenRut) : new Date();
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const statusIcon = diffDays < 0 ? '❌ QUÁ HẠN' : '⚠️ SẮP ĐẾN HẠN';
      
      message += `
-------------------------
${statusIcon} (${diffDays} ngày)
🚗 <b>${doc.xeMuaVao.dongXe}</b>
Biển: ${doc.xeMuaVao.bienSo}
Hạn rút: ${deadline.toLocaleDateString('vi-VN')}
Người giữ: ${doc.noiGiuHoSo}
`;
    }

    await sendTelegramNotification(message);

    return NextResponse.json({ 
      success: true, 
      count: overdueDocs.length,
      message: 'Notification sent' 
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
  }
}
