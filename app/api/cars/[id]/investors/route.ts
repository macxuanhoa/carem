import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createInvestor } from '@/lib/services/investor.service';

// POST: Thêm nhà đầu tư mới vào xe
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const carId = parseInt(id);
  
  try {
    const body = await request.json();
    const { nguoiGop, tyLeGop, soTienGop, giayToLienQuan } = body;

    const investor = await createInvestor({
        xeMuaVaoId: carId,
        nguoiGop,
        tyLeGop: Number(tyLeGop),
        soTienGop: Number(soTienGop),
        giayToLienQuan
    });

    return NextResponse.json(investor);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add investor' }, { status: 500 });
  }
}
