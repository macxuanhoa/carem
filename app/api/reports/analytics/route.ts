import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Lấy toàn bộ xe đã bán để tính lợi nhuận
    const soldCars = await prisma.xeMuaVao.findMany({
      where: {
        trangThai: 'DA_BAN',
        banRa: { isNot: null }
      },
      include: {
        banRa: true,
        chiPhi: true,
      }
    });

    // 2. Tính toán tài chính
    let totalRevenue = 0;
    let totalProfit = 0;
    let totalCost = 0;
    
    // Profit per Car
    const profitByCar = soldCars.map(car => {
        const revenue = car.banRa?.giaBan || 0;
        const baseCost = car.tongGiaMua;
        const extraCost = car.chiPhi.reduce((sum, cp) => sum + cp.giaThucTe, 0);
        const totalCarCost = baseCost + extraCost;
        const profit = revenue - totalCarCost;

        totalRevenue += revenue;
        totalProfit += profit;
        totalCost += totalCarCost;

        return {
            dongXe: car.dongXe,
            bienSo: car.bienSo,
            ngayBan: car.banRa?.ngayBan,
            revenue,
            cost: totalCarCost,
            profit,
            source: car.facebookLink // Phân tích nguồn sau này
        };
    });

    // 3. Phân tích tồn kho (Inventory Aging)
    const allCars = await prisma.xeMuaVao.findMany({
        where: { trangThai: { notIn: ['DA_BAN', 'HUY_GIAO_DICH'] } }
    });
    
    const today = new Date();
    const inventoryAging = allCars.map(car => {
        const daysInStock = Math.floor((today.getTime() - new Date(car.createdAt).getTime()) / (1000 * 3600 * 24));
        return {
            ...car,
            daysInStock
        };
    }).sort((a, b) => b.daysInStock - a.daysInStock).slice(0, 5); // Top 5 xe tồn lâu

    // 4. Dữ liệu biểu đồ doanh thu theo tháng (Giả lập 6 tháng gần nhất)
    const monthlyData: Record<string, { name: string; revenue: number; profit: number }> = {};
    soldCars.forEach(car => {
        if (car.banRa?.ngayBan) {
            const month = new Date(car.banRa.ngayBan).toLocaleString('vi-VN', { month: 'short', year: '2-digit' });
            if (!monthlyData[month]) monthlyData[month] = { name: month, revenue: 0, profit: 0 };
            
            const revenue = car.banRa.giaBan;
            const cost = car.tongGiaMua + car.chiPhi.reduce((s, c) => s + c.giaThucTe, 0);
            
            monthlyData[month].revenue += revenue;
            monthlyData[month].profit += (revenue - cost);
        }
    });
    
    const chartData = Object.values(monthlyData);

    // 5. Tính ROI (Return on Investment) cho từng xe
    const roiData = profitByCar.map(item => ({
        name: item.dongXe,
        roi: item.cost > 0 ? (item.profit / item.cost) * 100 : 0,
        profit: item.profit,
    })).sort((a, b) => b.roi - a.roi).slice(0, 10); // Top 10 ROI cao nhất

    // 6. Phân tích dòng tiền (Cash Flow)
    const cashFlow = {
        inCar: allCars.reduce((sum, car) => sum + car.tongGiaMua, 0), // Tiền nằm trong xe tồn kho
        receivable: soldCars.reduce((sum, car) => !car.banRa?.daThuDuTien ? sum + (car.banRa?.giaBan || 0) : sum, 0), // Tiền khách nợ
        payable: allCars.reduce((sum, car) => sum + (car.tongGiaMua - car.soTienDaChuyen), 0), // Tiền nợ người bán
        cashOnHand: totalProfit // Lợi nhuận thực tế (đơn giản hóa)
    };

    return NextResponse.json({
        financial: {
            totalRevenue,
            totalProfit,
            totalCost,
            margin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
        },
        chartData,
        topProfitCars: profitByCar.sort((a, b) => b.profit - a.profit).slice(0, 5),
        inventoryAging,
        roiData,
        cashFlow,
        exportData: profitByCar // Dữ liệu thô để xuất Excel
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
