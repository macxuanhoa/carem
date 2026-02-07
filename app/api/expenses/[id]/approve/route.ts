import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';

// PUT: Duyệt hoặc Từ chối chi phí
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const expenseId = parseInt(id);
  
  try {
    const body = await request.json();
    const { action, giaThucTe, nguoiDuyet, lyDoTuChoi } = body; 
    // action: 'APPROVE' | 'REJECT'

    const currentExpense = await prisma.chiPhiXe.findUnique({
        where: { id: expenseId }
    });

    if (!currentExpense) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (action === 'REJECT') {
        const updated = await prisma.chiPhiXe.update({
            where: { id: expenseId },
            data: {
                trangThai: 'TU_CHOI',
                nguoiDuyet,
                ghiChu: currentExpense.ghiChu ? `${currentExpense.ghiChu} | Lý do từ chối: ${lyDoTuChoi}` : `Lý do từ chối: ${lyDoTuChoi}`
            }
        });
        return NextResponse.json(updated);
    }

    if (action === 'APPROVE') {
        const updated = await prisma.chiPhiXe.update({
            where: { id: expenseId },
            data: {
                trangThai: 'DA_DUYET',
                giaThucTe: Number(giaThucTe), // Giá chốt cuối cùng
                nguoiDuyet
            }
        });

        // Log Audit nếu chênh lệch giá lớn (> 10%)
        if (currentExpense.giaDuKien > 0) {
            const diff = Math.abs(updated.giaThucTe - currentExpense.giaDuKien);
            const percent = (diff / currentExpense.giaDuKien) * 100;
            
            if (percent > 10) {
                await logAudit(
                    updated.xeMuaVaoId || 0,
                    nguoiDuyet,
                    'APPROVE_EXPENSE',
                    `Duyệt chi phí chênh lệch lớn: Dự kiến ${currentExpense.giaDuKien} -> Thực tế ${updated.giaThucTe}`
                );
            }
        }

        return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to approve expense' }, { status: 500 });
  }
}
