import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createExpense, getExpensesByCarId } from '@/lib/services/expense.service';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

    const expense = await createExpense({
        xeMuaVaoId: Number(xeMuaVaoId),
        loaiChiPhi,
        giaDuKien: Number(giaDuKien),
        giaThucTe: Number(giaThucTe),
        nguoiBaoGia,
        ghiChu,
        trangThai
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const carId = searchParams.get('carId');

    if (!carId) {
        return NextResponse.json({ error: 'Car ID required' }, { status: 400 });
    }

    const expenses = await getExpensesByCarId(Number(carId));

    return NextResponse.json(expenses);
}