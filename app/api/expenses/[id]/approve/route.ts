import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { approveExpense } from '@/lib/services/expense.service';

// PUT: Duyệt hoặc Từ chối chi phí
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only Admin can approve expenses
  if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Requires Admin role' }, { status: 403 });
  }

  const { id } = await params;
  const expenseId = parseInt(id);
  
  try {
    const body = await request.json();
    const { action, giaThucTe, nguoiDuyet, lyDoTuChoi } = body; 
    
    const updated = await approveExpense({
        id: expenseId,
        action,
        giaThucTe,
        nguoiDuyet,
        lyDoTuChoi
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to approve expense' }, { status: 500 });
  }
}
