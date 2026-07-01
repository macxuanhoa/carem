import { z } from 'zod';

export const carSchema = z.object({
  dongXe: z.string().min(1, "Tên dòng xe là bắt buộc"),
  bienSo: z.string().optional().or(z.literal('')),
  namSanXuat: z.coerce.number().min(1900, "Năm sản xuất không hợp lệ").max(new Date().getFullYear() + 1, "Năm sản xuất không hợp lệ"),
  mauXe: z.string().min(1, "Màu xe là bắt buộc"),
  soKhung: z.string().optional().or(z.literal('')),
  soMay: z.string().optional().or(z.literal('')),
  tongGiaMua: z.coerce.number().min(0, "Giá mua không được âm"),
  soTienCoc: z.coerce.number().min(0).optional().default(0),
  nguoiBan: z.string().optional().or(z.literal('')),
  soDienThoai: z.string().optional().or(z.literal('')),
  nguonGoc: z.string().optional().default('MUA_DAN'),
  nguoiGiuTien: z.string().optional().or(z.literal('')),
  tinhThanh: z.string().optional().or(z.literal('')),
  facebookLink: z.string().optional().or(z.literal('')),
  trangThai: z.string().optional(),
  hinhAnh: z.array(z.string()).optional().default([]),
  tinhTrang: z.coerce.number().min(0).max(100).optional().default(90),
  
  // Date fields (stored as string from form, converted to Date in DB)
  ngayHenGiao: z.string().optional().nullable(),
  ngayCoc: z.string().optional().nullable(),

  // Hồ sơ fields (optional for update)
  hoSo_trangThai: z.string().optional(),
  hoSo_noiGiu: z.string().optional(),
  hoSo_ngayHen: z.string().optional().nullable(),
  hoSo_nguoiPhuTrach: z.string().optional()
});

export type CarFormData = z.infer<typeof carSchema>;

export const expenseSchema = z.object({
  loaiChiPhi: z.string().min(1, "Loại chi phí là bắt buộc"),
  giaDuKien: z.coerce.number().min(0, "Giá dự kiến không được âm"),
  nguoiBaoGia: z.string().min(1, "Người đề xuất là bắt buộc"),
  ghiChu: z.string().optional().or(z.literal(''))
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

export const investorSchema = z.object({
  nguoiGop: z.string().min(1, "Tên người góp là bắt buộc"),
  soTienGop: z.coerce.number().min(1000, "Số tiền góp phải lớn hơn 0"),
  tyLeGop: z.coerce.number().min(0).max(100).optional(),
  ngayBatDau: z.string().optional().default(new Date().toISOString().split('T')[0]),
  ghiChu: z.string().optional().or(z.literal(''))
});

export type InvestorFormData = z.infer<typeof investorSchema>;
