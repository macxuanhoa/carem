import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';

export interface CreateInvestorData {
    xeMuaVaoId: number;
    nguoiGop: string;
    tyLeGop: number;
    soTienGop: number;
    giayToLienQuan?: string;
}

export interface UpdateInvestorData {
    id: number;
    action: 'ADD_PAYMENT' | 'UPDATE_STATUS';
    soTien?: number;
    ghiChu?: string;
    hinhAnh?: string;
    trangThaiMoi?: string;
}

export async function createInvestor(data: CreateInvestorData) {
    const investor = await prisma.xeGopDauTu.create({
        data: {
            xeMuaVaoId: data.xeMuaVaoId,
            nguoiGop: data.nguoiGop,
            tyLeGop: data.tyLeGop,
            soTienGop: data.soTienGop,
            giayToLienQuan: data.giayToLienQuan,
            trangThai: 'DANG_GOP'
        }
    });

    await logAudit(
        data.xeMuaVaoId,
        'System',
        'ADD_INVESTOR',
        `Thêm NĐT ${data.nguoiGop} - Tỷ lệ ${data.tyLeGop}% - Cam kết góp ${data.soTienGop.toLocaleString()}`
    );

    return investor;
}

export async function updateInvestor(data: UpdateInvestorData) {
    const { id, action, soTien, ghiChu, hinhAnh, trangThaiMoi } = data;

    // 1. Nếu là nộp tiền thêm
    if (action === 'ADD_PAYMENT') {
        const payment = await prisma.lichSuGopVon.create({
            data: {
                xeGopDauTuId: id,
                soTien: Number(soTien),
                ghiChu,
                hinhAnh
            }
        });

        // Tự động cộng dồn vào bảng cha
        await prisma.xeGopDauTu.update({
            where: { id },
            data: {
                daGop: { increment: Number(soTien) }
            }
        });

        return payment;
    }

    // 2. Nếu là cập nhật trạng thái (vd: Tranh chấp, Tất toán)
    if (action === 'UPDATE_STATUS') {
        if (!trangThaiMoi) throw new Error('New status is required');
        
        const updated = await prisma.xeGopDauTu.update({
            where: { id },
            data: { trangThai: trangThaiMoi }
        });
        return updated;
    }

    throw new Error('Invalid action');
}
