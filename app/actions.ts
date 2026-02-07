'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { carSchema, CarFormData } from '@/lib/schemas';

export async function deleteCar(id: number) {
  try {
    // With onDelete: Cascade in Prisma schema, we just need to delete the parent
    await prisma.xeMuaVao.delete({ where: { id } });
  } catch (error: any) {
    console.error('Failed to delete car:', error);
    throw new Error(error.message || 'Failed to delete car');
  }

  revalidatePath('/cars');
  revalidatePath('/');
}

export async function updateCar(id: number, rawData: CarFormData) {
    // 1. Validate Input Data
    const validationResult = carSchema.safeParse(rawData);
    
    if (!validationResult.success) {
        console.error('Validation Failed:', validationResult.error.flatten());
        throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }

    const data = validationResult.data;

    try {
        // Auto-update Status logic: If adding FB link and status is 'TIM_THAY', change to 'DANG_BAN'
        let newStatus = data.trangThai || 'TIM_THAY';
        if (data.facebookLink && data.facebookLink.length > 0 && newStatus === 'TIM_THAY') {
             newStatus = 'DANG_BAN';
        }

        await prisma.xeMuaVao.update({
            where: { id },
            data: {
                dongXe: data.dongXe,
                bienSo: data.bienSo,
                namSanXuat: data.namSanXuat,
                mauXe: data.mauXe,
                soKhung: data.soKhung,
                soMay: data.soMay,
                tongGiaMua: data.tongGiaMua,
                nguoiBan: data.nguoiBan,
                nguoiGiuTien: data.nguoiGiuTien,
                tinhThanh: data.tinhThanh,
                facebookLink: data.facebookLink,
                trangThai: newStatus,
                hinhAnh: JSON.stringify(data.hinhAnh) // Serialize array to JSON string
            }
        });

        // Upsert HoSoXe
        await prisma.hoSoXe.upsert({
            where: { xeMuaVaoId: id },
            update: {
                trangThai: data.hoSo_trangThai || 'CHUA_CAN',
                noiGiuHoSo: data.hoSo_noiGiu || 'CHU_CU',
                ngayHenRut: data.hoSo_ngayHen ? new Date(data.hoSo_ngayHen) : null,
                nguoiChiuTrachNhiem: data.hoSo_nguoiPhuTrach || ''
            },
            create: {
                xeMuaVaoId: id,
                trangThai: data.hoSo_trangThai || 'CHUA_CAN',
                noiGiuHoSo: data.hoSo_noiGiu || 'CHU_CU',
                ngayHenRut: data.hoSo_ngayHen ? new Date(data.hoSo_ngayHen) : null,
                nguoiChiuTrachNhiem: data.hoSo_nguoiPhuTrach || ''
            }
        });

    } catch (error) {
        console.error('Failed to update car:', error);
        throw new Error('Failed to update car');
    }

    revalidatePath(`/cars/${id}`);
    revalidatePath('/cars');
    redirect(`/cars/${id}`);
}
