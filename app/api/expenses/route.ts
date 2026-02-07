import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
        xeMuaVaoId, 
        loaiChiPhi, 
        giaDuKien, 
        giaThucTe, 
        nguoiBaoGia, 
        ghiChu,
        trangThai
    } = body;

    const expense = await prisma.$transaction(async (tx) => {
        // 1. Create Expense
        const newExpense = await tx.chiPhiXe.create({
            data: {
                xeMuaVaoId: Number(xeMuaVaoId),
                loaiChiPhi,
                giaDuKien: Number(giaDuKien),
                giaThucTe: Number(giaThucTe || giaDuKien), // Default to estimate if not provided
                nguoiBaoGia,
                trangThai: trangThai || 'DA_DUYET', // Auto-approve for now for simplicity
                ghiChu
            }
        });

        // 2. Log History
        await tx.lichSuThayDoi.create({
            data: {
                xeMuaVaoId: Number(xeMuaVaoId),
                nguoiThucHien: nguoiBaoGia,
                hanhDong: 'ADD_EXPENSE',
                chiTiet: `Thêm chi phí: ${loaiChiPhi} - ${Number(giaThucTe || giaDuKien).toLocaleString()}đ`
            }
        });

        return newExpense;
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get('carId');

    if (!carId) {
        return NextResponse.json({ error: 'Car ID required' }, { status: 400 });
    }

    const expenses = await prisma.chiPhiXe.findMany({
        where: { xeMuaVaoId: Number(carId) },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(expenses);
}