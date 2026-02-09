import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';
import { sendTelegramNotification } from '@/lib/telegram';

export interface CreateExpenseData {
    xeMuaVaoId: number;
    loaiChiPhi: string;
    giaDuKien: number;
    giaThucTe?: number;
    nguoiBaoGia: string;
    ghiChu?: string;
    trangThai?: string;
}

export interface ApproveExpenseData {
    id: number;
    action: 'APPROVE' | 'REJECT';
    giaThucTe?: number;
    nguoiDuyet: string;
    lyDoTuChoi?: string;
}

export async function createExpense(data: CreateExpenseData) {
    const expense = await prisma.$transaction(async (tx) => {
        // 1. Create Expense
        const newExpense = await tx.chiPhiXe.create({
            data: {
                xeMuaVaoId: data.xeMuaVaoId,
                loaiChiPhi: data.loaiChiPhi,
                giaDuKien: data.giaDuKien,
                giaThucTe: data.giaThucTe || (data.trangThai === 'DA_DUYET' ? data.giaDuKien : 0),
                nguoiBaoGia: data.nguoiBaoGia,
                trangThai: data.trangThai || 'CHO_DUYET',
                ghiChu: data.ghiChu
            },
            include: {
                xeMuaVao: true
            }
        });

        // 2. Log History
        await tx.lichSuThayDoi.create({
            data: {
                xeMuaVaoId: data.xeMuaVaoId,
                nguoiThucHien: data.nguoiBaoGia,
                hanhDong: 'ADD_EXPENSE',
                chiTiet: `Thêm chi phí: ${data.loaiChiPhi} - ${data.giaDuKien.toLocaleString()}đ`
            }
        });

        return newExpense;
    });

    // Notify Telegram if needed (only for pending approval)
    if (expense.trangThai === 'CHO_DUYET') {
        const message = `
⚠️ <b>DUYỆT CHI PHÍ MỚI</b>
-------------------------
Xe: <b>${expense.xeMuaVao?.dongXe}</b>
Biển số: ${expense.xeMuaVao?.bienSo}
-------------------------
📝 <b>Nội dung:</b> ${expense.loaiChiPhi}
💰 <b>Số tiền:</b> ${expense.giaDuKien.toLocaleString()} đ
👤 <b>Người báo:</b> ${expense.nguoiBaoGia}
-------------------------
<i>Vui lòng vào app để duyệt!</i>
`;
        await sendTelegramNotification(message);
    }

    return expense;
}

export async function approveExpense(data: ApproveExpenseData) {
    const { id, action, giaThucTe, nguoiDuyet, lyDoTuChoi } = data;

    const currentExpense = await prisma.chiPhiXe.findUnique({
        where: { id }
    });

    if (!currentExpense) throw new Error('Expense not found');

    if (action === 'REJECT') {
        return await prisma.chiPhiXe.update({
            where: { id },
            data: {
                trangThai: 'TU_CHOI',
                nguoiDuyet,
                ghiChu: currentExpense.ghiChu ? `${currentExpense.ghiChu} | Lý do từ chối: ${lyDoTuChoi}` : `Lý do từ chối: ${lyDoTuChoi}`
            }
        });
    }

    if (action === 'APPROVE') {
        const updated = await prisma.chiPhiXe.update({
            where: { id },
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

        return updated;
    }

    throw new Error('Invalid action');
}

export async function deleteExpense(id: number) {
    const expense = await prisma.chiPhiXe.findUnique({ where: { id } });
    if (!expense) throw new Error('Expense not found');

    await prisma.$transaction([
        prisma.chiPhiXe.delete({ where: { id } }),
        prisma.lichSuThayDoi.create({
            data: {
                xeMuaVaoId: expense.xeMuaVaoId || 0,
                nguoiThucHien: 'System',
                hanhDong: 'DELETE_EXPENSE',
                chiTiet: `Xóa chi phí: ${expense.loaiChiPhi}`
            }
        })
    ]);

    return true;
}

export async function getExpensesByCarId(carId: number) {
    return await prisma.chiPhiXe.findMany({
        where: { xeMuaVaoId: carId },
        orderBy: { createdAt: 'desc' }
    });
}
