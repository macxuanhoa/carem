import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    try {
        const expense = await prisma.chiPhiXe.findUnique({ where: { id: Number(id) } });
        if (!expense) return NextResponse.json({ error: 'Expense not found' }, { status: 404 });

        await prisma.$transaction([
            prisma.chiPhiXe.delete({ where: { id: Number(id) } }),
            prisma.lichSuThayDoi.create({
                data: {
                    xeMuaVaoId: expense.xeMuaVaoId || 0,
                    nguoiThucHien: 'System',
                    hanhDong: 'DELETE_EXPENSE',
                    chiTiet: `Xóa chi phí: ${expense.loaiChiPhi}`
                }
            })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}