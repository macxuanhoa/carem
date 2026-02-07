import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount).replace('₫', 'đ'); // Replace symbol for cleaner look
}

export function formatShortDate(dateStr: string | Date): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

export function formatTimeAgo(dateStr: string | Date): string {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm trước";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng trước";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày trước";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ trước";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút trước";
    return "Vừa xong";
}

export function formatStatus(status: string): string {
    const map: Record<string, string> = {
        'TIM_THAY': 'Mới Về',
        'DA_COC': 'Đã Cọc',
        'DA_MUA': 'Đã Mua',
        'DANG_DON': 'Đang Dọn',
        'DA_CHUYEN_TIEN': 'Đã Chuyển Tiền',
        'CHO_GIAO_XE': 'Chờ Giao Xe',
        'XE_DA_VE': 'Xe Đã Về',
        'DANG_BAN': 'Đang Bán',
        'DA_BAN': 'Đã Bán',
        'HUY_GIAO_DICH': 'Hủy Giao Dịch',
        'QUA_HAN': 'Quá Hạn',
        'CHO_DUYET': 'Chờ Duyệt',
        'DA_DUYET': 'Đã Duyệt',
        'TU_CHOI': 'Từ Chối'
    };
    return map[status] || status.replace(/_/g, ' ');
}
