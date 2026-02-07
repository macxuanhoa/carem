import { z } from 'zod';

export const carSchema = z.object({
  dongXe: z.string().min(1, "Tên dòng xe là bắt buộc"),
  bienSo: z.string().optional().or(z.literal('')),
  namSanXuat: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  mauXe: z.string().min(1, "Màu xe là bắt buộc"),
  soKhung: z.string().optional().or(z.literal('')),
  soMay: z.string().optional().or(z.literal('')),
  tongGiaMua: z.coerce.number().min(0, "Giá mua không được âm"),
  soTienCoc: z.coerce.number().min(0).optional().default(0),
  nguoiBan: z.string().min(1, "Người bán là bắt buộc"),
  nguoiGiuTien: z.string().optional().or(z.literal('')),
  tinhThanh: z.string().min(1, "Tỉnh thành là bắt buộc"),
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
