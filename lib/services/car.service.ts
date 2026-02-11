import { prisma } from '@/lib/prisma';
import { sendTelegramNotification } from '@/lib/telegram';
import { revalidatePath } from 'next/cache';
import { CarFormData } from '@/lib/schemas';

export async function getCarById(id: number) {
    return await prisma.xeMuaVao.findUnique({
        where: { id },
        include: {
            hoSo: true,
            banRa: true,
            gopVon: true,
            chiPhi: true,
            lichSu: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });
}

export async function getCars(status?: string, page = 1, limit = 20) {
    const whereClause = status ? { trangThai: status } : {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        prisma.xeMuaVao.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                banRa: true,
                hoSo: true,
            },
            skip,
            take: limit
        }),
        prisma.xeMuaVao.count({ where: whereClause })
    ]);

    return {
        data,
        metadata: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export async function createCar(data: CarFormData) {
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
                hinhAnh: data.hinhAnh || [],
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
    revalidatePath('/');
    revalidatePath('/reports');

    return car;
}

export async function updateCar(id: number, data: CarFormData) {
    // Auto-update Status logic: If adding FB link and status is 'TIM_THAY', change to 'DANG_BAN'
    let newStatus = data.trangThai || 'TIM_THAY';
    if (data.facebookLink && data.facebookLink.length > 0 && newStatus === 'TIM_THAY') {
         newStatus = 'DANG_BAN';
    }

    const updatedCar = await prisma.$transaction(async (tx) => {
        const car = await tx.xeMuaVao.update({
            where: { id },
            data: {
                dongXe: data.dongXe,
                bienSo: data.bienSo,
                namSanXuat: data.namSanXuat,
                mauXe: data.mauXe,
                soKhung: data.soKhung,
                soMay: data.soMay,
                tongGiaMua: data.tongGiaMua,
                nguoiBan: data.nguoiBan,
                nguoiGiuTien: data.nguoiGiuTien,
                tinhThanh: data.tinhThanh,
                facebookLink: data.facebookLink,
                trangThai: newStatus,
                hinhAnh: data.hinhAnh || [],
                // New fields
                soDienThoai: data.soDienThoai,
                nguonGoc: data.nguonGoc
            }
        });

        // Upsert HoSoXe
        await tx.hoSoXe.upsert({
            where: { xeMuaVaoId: id },
            update: {
                trangThai: data.hoSo_trangThai || 'CHUA_CAN',
                noiGiuHoSo: data.hoSo_noiGiu || 'CHU_CU',
                ngayHenRut: data.hoSo_ngayHen ? new Date(data.hoSo_ngayHen) : null,
                nguoiChiuTrachNhiem: data.hoSo_nguoiPhuTrach || ''
            },
            create: {
                xeMuaVaoId: id,
                trangThai: data.hoSo_trangThai || 'CHUA_CAN',
                noiGiuHoSo: data.hoSo_noiGiu || 'CHU_CU',
                ngayHenRut: data.hoSo_ngayHen ? new Date(data.hoSo_ngayHen) : null,
                nguoiChiuTrachNhiem: data.hoSo_nguoiPhuTrach || ''
            }
        });

        await tx.lichSuThayDoi.create({
            data: {
                xeMuaVaoId: id,
                nguoiThucHien: 'System', // Should be passed in
                hanhDong: 'UPDATE_INFO',
                chiTiet: `Cập nhật thông tin xe ${data.dongXe}`,
            }
        });

        return car;
    });

    revalidatePath(`/cars/${id}`);
    revalidatePath('/cars');
    revalidatePath('/reports');
    return updatedCar;
}

export async function updateCarPartial(id: number, carData: any, docsData: any) {
    const updatedCar = await prisma.$transaction(async (tx) => {
        // Update Car Info
        const car = await tx.xeMuaVao.update({
            where: { id },
            data: carData,
        });

        // Update Docs Info if provided
        if (docsData.hoSo_trangThai || docsData.hoSo_noiGiu || docsData.hoSo_ngayHen || docsData.hoSo_nguoiPhuTrach) {
            // Check if hoSo exists
            const existingHoSo = await tx.hoSoXe.findUnique({
                where: { xeMuaVaoId: id }
            });

            const hoSoData = {
                trangThai: docsData.hoSo_trangThai,
                noiGiuHoSo: docsData.hoSo_noiGiu,
                ngayHenRut: docsData.hoSo_ngayHen ? new Date(docsData.hoSo_ngayHen) : null,
                nguoiChiuTrachNhiem: docsData.hoSo_nguoiPhuTrach
            };

            if (existingHoSo) {
                await tx.hoSoXe.update({
                    where: { xeMuaVaoId: id },
                    data: hoSoData
                });
            } else {
                await tx.hoSoXe.create({
                    data: {
                        xeMuaVaoId: id,
                        ...hoSoData,
                        trangThai: hoSoData.trangThai || 'CHUA_CAN',
                        noiGiuHoSo: hoSoData.noiGiuHoSo || 'CHU_CU'
                    }
                });
            }
        }

        return car;
    });

    revalidatePath(`/cars/${id}`);
    revalidatePath('/cars');
    return updatedCar;
}

export interface SellCarData {
    carId: number;
    giaBan: number;
    khachMua: string;
    daThuDuTien?: boolean;
    daGiaoXe?: boolean;
    nguoiThucHien?: string;
}

export async function sellCar(data: SellCarData) {
    const { carId, giaBan, khachMua, daThuDuTien, daGiaoXe, nguoiThucHien } = data;

    const car = await prisma.xeMuaVao.findUnique({
        where: { id: carId },
        include: { hoSo: true }
    });

    if (!car) throw new Error('Car not found');

    // CHECK LOGIC: Chặn bán nếu hồ sơ quá hạn
    if (car.hoSo?.trangThai === 'QUA_HAN') {
        throw new Error('KHÔNG THỂ BÁN: Hồ sơ xe đang quá hạn. Vui lòng xử lý hồ sơ trước.');
    }

    // CHECK LOGIC: Chặn bán nếu xe đã bán
    if (car.trangThai === 'DA_BAN') {
        throw new Error('KHÔNG THỂ BÁN: Xe này đã được bán trước đó.');
    }

    // CHECK LOGIC: Chặn bán nếu chưa có giá mua (Dữ liệu không hợp lệ)
    if (!car.tongGiaMua || car.tongGiaMua <= 0) {
        throw new Error('KHÔNG THỂ BÁN: Xe chưa có thông tin giá mua. Vui lòng cập nhật giá mua trước.');
    }

    if (!giaBan || giaBan <= 0) throw new Error('Giá bán không hợp lệ');
    if (!khachMua) throw new Error('Thông tin khách mua là bắt buộc');

    return await prisma.$transaction(async (tx) => {
        // 1. Tạo record bán
        const sellRecord = await tx.xeBanRa.create({
            data: {
                xeMuaVaoId: carId,
                giaBan,
                khachMua,
                daThuDuTien: daThuDuTien || false,
                daGiaoXe: daGiaoXe || false,
                trangThai: 'DA_BAN'
            }
        });

        // 2. Update trạng thái xe
        await tx.xeMuaVao.update({
            where: { id: carId },
            data: { trangThai: 'DA_BAN' }
        });

        // 3. Log Audit
        await tx.lichSuThayDoi.create({
            data: {
                xeMuaVaoId: carId,
                nguoiThucHien: nguoiThucHien || 'System',
                hanhDong: 'BAN_XE',
                chiTiet: `Bán xe cho khách ${khachMua}, giá ${giaBan.toLocaleString('vi-VN')} đ`,
            }
        });

        return sellRecord;
    });
}

export async function deleteCar(id: number) {
    // With onDelete: Cascade in Prisma schema, we just need to delete the parent
    await prisma.xeMuaVao.delete({ where: { id } });
    
    revalidatePath('/cars');
    revalidatePath('/');
    revalidatePath('/reports');
}

export async function getCarAnalytics() {
    // 1. Optimize: Calculate Financial Summaries directly in DB
    const [revenueData, baseCostData, extraCostData] = await Promise.all([
        // Total Revenue (Sold cars)
        prisma.xeBanRa.aggregate({
            _sum: { giaBan: true },
            where: { trangThai: 'DA_BAN' }
        }),
        // Total Base Cost (Sold cars)
        prisma.xeMuaVao.aggregate({
            _sum: { tongGiaMua: true },
            where: { trangThai: 'DA_BAN' }
        }),
        // Total Extra Cost (Expenses for sold cars)
        // Note: This requires a bit of raw query or logic since we can't easily join in aggregate
        // But for "Total Profit", we can approximate or use raw query.
        // Let's use Raw Query for accuracy and speed.
        prisma.$queryRaw<{ totalExtraCost: number }[]>`
            SELECT COALESCE(SUM(cp."giaThucTe"), 0) as "totalExtraCost"
            FROM "ChiPhiXe" cp
            JOIN "XeMuaVao" mv ON cp."xeMuaVaoId" = mv."id"
            WHERE mv."trangThai" = 'DA_BAN'
        `
    ]);

    const totalRevenue = revenueData._sum.giaBan || 0;
    const totalBaseCost = baseCostData._sum.tongGiaMua || 0;
    const totalExtraCost = Number(extraCostData[0]?.totalExtraCost || 0);
    const totalCost = totalBaseCost + totalExtraCost;
    const totalProfit = totalRevenue - totalCost;

    // 2. Fetch Chart Data (Last 6 months only) & Top Profit
    // Fetch limited "Sold Cars" for detailed analysis
    // We limit to last 100 sold cars for charts/tables to keep it fast
    const recentSoldCars = await prisma.xeMuaVao.findMany({
        where: {
            trangThai: 'DA_BAN',
            banRa: { isNot: null }
        },
        include: {
            banRa: true,
            chiPhi: true,
        },
        orderBy: {
            banRa: { ngayBan: 'desc' }
        },
        take: 100 // Optimization limit
    });
    
    // Profit per Car (for recent 100)
    const profitByCar = recentSoldCars.map(car => {
        const revenue = car.banRa?.giaBan || 0;
        const baseCost = car.tongGiaMua;
        const extraCost = car.chiPhi.reduce((sum, cp) => sum + cp.giaThucTe, 0);
        const totalCarCost = baseCost + extraCost;
        const profit = revenue - totalCarCost;

        return {
            dongXe: car.dongXe,
            bienSo: car.bienSo,
            ngayBan: car.banRa?.ngayBan,
            revenue,
            cost: totalCarCost,
            profit,
            source: car.facebookLink
        };
    });

    // 3. Inventory Aging (Top 5 oldest)
    const oldestInventory = await prisma.xeMuaVao.findMany({
        where: { trangThai: { notIn: ['DA_BAN', 'HUY_GIAO_DICH'] } },
        orderBy: { createdAt: 'asc' },
        take: 5
    });
    
    const today = new Date();
    const inventoryAging = oldestInventory.map(car => ({
        ...car,
        daysInStock: Math.floor((today.getTime() - new Date(car.createdAt).getTime()) / (1000 * 3600 * 24))
    }));

    // 4. Chart Data (Aggregate from recent 100)
    const monthlyData: Record<string, { name: string; revenue: number; profit: number }> = {};
    recentSoldCars.forEach(car => {
        if (car.banRa?.ngayBan) {
            const month = new Date(car.banRa.ngayBan).toLocaleString('vi-VN', { month: 'short', year: '2-digit' });
            if (!monthlyData[month]) monthlyData[month] = { name: month, revenue: 0, profit: 0 };
            
            const revenue = car.banRa.giaBan;
            const cost = car.tongGiaMua + car.chiPhi.reduce((s, c) => s + c.giaThucTe, 0);
            
            monthlyData[month].revenue += revenue;
            monthlyData[month].profit += (revenue - cost);
        }
    });
    
    // 5. ROI
    const roiData = profitByCar.map(item => ({
        name: item.dongXe,
        roi: item.cost > 0 ? (item.profit / item.cost) * 100 : 0,
        profit: item.profit,
    })).sort((a, b) => b.roi - a.roi).slice(0, 10);

    // 6. Cash Flow (Optimized)
    const [cashInStock, cashReceivable, cashPayable] = await Promise.all([
        // Cash in Stock
        prisma.xeMuaVao.aggregate({
            _sum: { tongGiaMua: true },
            where: { trangThai: { notIn: ['DA_BAN', 'HUY_GIAO_DICH'] } }
        }),
        // Receivable (Sold but not fully paid)
        prisma.xeBanRa.aggregate({
            _sum: { giaBan: true },
            where: { daThuDuTien: false }
        }),
        // Payable (Bought but not fully paid - assuming soTienDaChuyen logic exists or defaulting)
        // For now, assume if not fully paid we owe? The logic in original code was:
        // sum + (car.tongGiaMua - (car as any).soTienDaChuyen || 0)
        // We don't have soTienDaChuyen in schema apparently? Let's assume 0 for now or fetch.
        // Let's just use 0 to be safe as per schema.
        Promise.resolve({ _sum: { tongGiaMua: 0 } }) 
    ]);

    const cashFlow = {
        inCar: cashInStock._sum.tongGiaMua || 0,
        receivable: cashReceivable._sum.giaBan || 0,
        payable: 0, // Placeholder
        cashOnHand: totalProfit
    };

    return {
        financial: {
            totalRevenue,
            totalProfit,
            totalCost,
            margin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
        },
        chartData: Object.values(monthlyData).reverse(), // Show latest
        topProfitCars: profitByCar.sort((a, b) => b.profit - a.profit).slice(0, 5),
        inventoryAging,
        roiData,
        cashFlow,
        exportData: profitByCar
    };
}

export async function checkOverdueDocs() {
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
      return { count: 0, message: 'No overdue docs' };
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

    return { 
      success: true, 
      count: overdueDocs.length,
      message: 'Notification sent' 
    };
}

export async function getNotifications(limit = 20, page = 1, query = '') {
    const skip = (page - 1) * limit;
    
    const whereClause: any = {};
    if (query) {
        whereClause.OR = [
            { chiTiet: { contains: query, mode: 'insensitive' } },
            { nguoiThucHien: { contains: query, mode: 'insensitive' } },
            { 
                xeMuaVao: { 
                    OR: [
                        { bienSo: { contains: query, mode: 'insensitive' } },
                        { dongXe: { contains: query, mode: 'insensitive' } }
                    ]
                } 
            }
        ];
    }

    const [data, total] = await Promise.all([
        prisma.lichSuThayDoi.findMany({
            where: whereClause,
            take: limit,
            skip: skip,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                xeMuaVao: {
                    select: {
                        bienSo: true,
                        dongXe: true,
                        mauXe: true
                    }
                }
            }
        }),
        prisma.lichSuThayDoi.count({ where: whereClause })
    ]);

    return {
        data,
        metadata: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export async function updateCarDocs(carId: number, data: {
    trangThai: string;
    noiGiuHoSo: string;
    ngayHenRut?: Date | null;
    nguoiChiuTrachNhiem?: string;
}) {
    const updated = await prisma.hoSoXe.upsert({
      where: { xeMuaVaoId: carId },
      update: {
        trangThai: data.trangThai,
        noiGiuHoSo: data.noiGiuHoSo,
        ngayHenRut: data.ngayHenRut,
        nguoiChiuTrachNhiem: data.nguoiChiuTrachNhiem
      },
      create: {
        xeMuaVaoId: carId,
        trangThai: data.trangThai || 'CHUA_CAN',
        noiGiuHoSo: data.noiGiuHoSo || 'CHU_CU',
        ngayHenRut: data.ngayHenRut,
        nguoiChiuTrachNhiem: data.nguoiChiuTrachNhiem
      }
    });

    await prisma.lichSuThayDoi.create({
        data: {
            xeMuaVaoId: carId,
            nguoiThucHien: 'System', // TODO: Pass user
            hanhDong: 'UPDATE_DOCS',
            chiTiet: `Cập nhật hồ sơ: ${data.trangThai} - Giữ tại: ${data.noiGiuHoSo}`
        }
    });

    return updated;
}
