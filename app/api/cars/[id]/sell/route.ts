import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const carId = parseInt(id);
  
  try {
    const car = await prisma.xeMuaVao.findUnique({
      where: { id: carId },
      include: { hoSo: true }
    });

    if (!car) {
        return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    // CHECK LOGIC: Chặn bán nếu hồ sơ quá hạn
    if (car.hoSo?.trangThai === 'QUA_HAN') {
        return NextResponse.json({ 
            error: 'KHÔNG THỂ BÁN: Hồ sơ xe đang quá hạn. Vui lòng xử lý hồ sơ trước.' 
        }, { status: 400 });
    }

    // CHECK LOGIC: Chặn bán nếu xe đã bán
    if (car.trangThai === 'DA_BAN') {
        return NextResponse.json({
            error: 'KHÔNG THỂ BÁN: Xe này đã được bán trước đó.'
        }, { status: 400 });
    }

    // CHECK LOGIC: Chặn bán nếu chưa có giá mua (Dữ liệu không hợp lệ)
    if (!car.tongGiaMua || car.tongGiaMua <= 0) {
        return NextResponse.json({
            error: 'KHÔNG THỂ BÁN: Xe chưa có thông tin giá mua. Vui lòng cập nhật giá mua trước.'
        }, { status: 400 });
    }

    const body = await request.json();
    const { giaBan, khachMua, daThuDuTien, daGiaoXe } = body;

    if (!giaBan || Number(giaBan) <= 0) {
        return NextResponse.json({ error: 'Giá bán không hợp lệ' }, { status: 400 });
    }
    if (!khachMua) {
        return NextResponse.json({ error: 'Thông tin khách mua là bắt buộc' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Tạo record bán (Đảm bảo duy nhất)
      // Do đã check trạng thái DA_BAN ở trên, ta tự tin create mới.
      // Tuy nhiên để an toàn tuyệt đối, dùng upsert hoặc check lại cũng được, 
      // nhưng ở đây ta sẽ dùng create và để database constraint (unique xeMuaVaoId) chặn nếu có lỗi race condition.
      
      const sellRecord = await tx.xeBanRa.create({
        data: {
            xeMuaVaoId: carId,
            giaBan: Number(giaBan),
            khachMua,
            daThuDuTien: daThuDuTien || false,
            daGiaoXe: daGiaoXe || false,
            trangThai: 'DA_BAN' // Trạng thái của giao dịch bán
        }
      });

      // 2. Update trạng thái xe - Luôn chuyển thành DA_BAN
      await tx.xeMuaVao.update({
          where: { id: carId },
          data: { 
              trangThai: 'DA_BAN',
              // Cập nhật lại ngày bán thực tế nếu cần, hoặc để giữ nguyên logic cũ
          }
      });
      
      // 3. Log Audit
      await tx.lichSuThayDoi.create({
          data: {
              xeMuaVaoId: carId,
              nguoiThucHien: 'Admin', // TODO: Lấy từ session user
              hanhDong: 'BAN_XE',
              chiTiet: `Bán xe cho khách ${khachMua}, giá ${Number(giaBan).toLocaleString('vi-VN')} đ`,
          }
      });

      return sellRecord;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create sell record' }, { status: 500 });
  }
}
