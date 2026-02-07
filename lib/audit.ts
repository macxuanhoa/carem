import { prisma } from '@/lib/prisma';

export const AUDIT_ACTIONS = {
  CREATE_CAR: 'Tạo mới xe',
  UPDATE_STATUS: 'Cập nhật trạng thái',
  UPDATE_PRICE: 'Cập nhật giá',
  ADD_EXPENSE: 'Thêm chi phí',
  UPDATE_DOCS: 'Cập nhật hồ sơ',
  SELL_CAR: 'Bán xe',
};

/**
 * Ghi lại lịch sử thay đổi của xe
 * @param xeId ID của xe
 * @param user Tên người thực hiện (Hardcode hoặc lấy từ session)
 * @param action Hành động (Dùng constant AUDIT_ACTIONS)
 * @param detail Chi tiết thay đổi (Vd: "Đổi giá từ 500tr -> 510tr")
 */
export async function logAudit(xeId: number, user: string, action: string, detail: string) {
  try {
    await prisma.lichSuThayDoi.create({
      data: {
        xeMuaVaoId: xeId,
        nguoiThucHien: user,
        hanhDong: action,
        chiTiet: detail,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // Audit log failure shouldn't break the main flow, so we catch it silent-ish
  }
}
