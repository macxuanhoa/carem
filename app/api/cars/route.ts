import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit, AUDIT_ACTIONS } from '@/lib/audit';
import { sendTelegramNotification } from '@/lib/telegram';
import { carSchema } from '@/lib/schemas';
import { revalidateTag } from 'next/cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    const whereClause = status ? { trangThai: status } : {};

    const cars = await prisma.xeMuaVao.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        banRa: true,
        hoSo: true,
      },
    });
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate with Zod
    const validationResult = carSchema.safeParse(body);
    if (!validationResult.success) {
        return NextResponse.json({ 
            error: 'Validation failed', 
            details: validationResult.error.flatten() 
        }, { status: 400 });
    }

    const data = validationResult.data;

    // Determine initial status
    let initialStatus = data.trangThai || 'TIM_THAY';
    
    // Only apply auto-logic if no status was explicitly provided (or if it's the default TIM_THAY)
    if (!data.trangThai || data.trangThai === 'TIM_THAY') {
        // Logic: Nếu đã cọc -> DA_COC
        if (data.soTienCoc && data.soTienCoc > 0) {
            initialStatus = 'DA_COC';
        } 
        // Logic: Nếu có link FB nhưng chưa cọc -> DANG_BAN
        else if (data.facebookLink && data.facebookLink.length > 0) {
            initialStatus = 'DANG_BAN';
        }
    }

    const car = await prisma.$transaction(async (tx) => {
       const newCar = await tx.xeMuaVao.create({
        data: {
            bienSo: data.bienSo,
            dongXe: data.dongXe,
            namSanXuat: data.namSanXuat,
            mauXe: data.mauXe,
            nguoiBan: data.nguoiBan || '',
            tinhThanh: data.tinhThanh || '',
            soTienCoc: data.soTienCoc,
            tongGiaMua: data.tongGiaMua,
            ngayHenGiao: data.ngayHenGiao ? new Date(data.ngayHenGiao) : null,
            facebookLink: data.facebookLink || '',
            nguoiGiuTien: data.nguoiGiuTien,
            trangThai: initialStatus,
            // New fields
            soKhung: data.soKhung,
            soMay: data.soMay,
            ngayCoc: data.ngayCoc ? new Date(data.ngayCoc) : (data.soTienCoc > 0 ? new Date() : null),
            tinhTrang: data.tinhTrang,
            hinhAnh: JSON.stringify(data.hinhAnh),
          },
       });

       await tx.hoSoXe.create({
         data: { 
             xeMuaVaoId: newCar.id,
             trangThai: data.hoSo_trangThai || 'CHUA_CAN',
             noiGiuHoSo: data.hoSo_noiGiu || 'CHU_CU',
             ngayHenRut: data.hoSo_ngayHen ? new Date(data.hoSo_ngayHen) : null,
             nguoiChiuTrachNhiem: data.hoSo_nguoiPhuTrach || ''
         }
       });

       await tx.lichSuThayDoi.create({
           data: {
               xeMuaVaoId: newCar.id,
               nguoiThucHien: 'System', 
               hanhDong: 'CREATE_CAR',
               chiTiet: `Tạo mới xe ${data.dongXe}, trạng thái ${initialStatus}`,
           }
       });

       return newCar;
    });

    // Notify Telegram
    const message = `
🚗 <b>XE MỚI NHẬP KHO</b>
-------------------------
📌 <b>Dòng xe:</b> ${car.dongXe}
📅 <b>Đời:</b> ${car.namSanXuat}
🎨 <b>Màu:</b> ${car.mauXe}
💰 <b>Giá nhập:</b> ${car.tongGiaMua.toLocaleString()} đ
📍 <b>Khu vực:</b> ${car.tinhThanh}
-------------------------
<i>Trạng thái: ${car.trangThai}</i>
`;
    await sendTelegramNotification(message);

    // Force revalidate dashboard cache
    revalidateTag('dashboard');

    return NextResponse.json(car);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}
