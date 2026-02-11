'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { carSchema, CarFormData, expenseSchema, ExpenseFormData, investorSchema, InvestorFormData } from '@/lib/schemas';
import { signOut, auth } from '@/auth';
import * as CarService from '@/lib/services/car.service';
import * as ExpenseService from '@/lib/services/expense.service';
import * as InvestorService from '@/lib/services/investor.service';
import { executeAction } from '@/lib/action-utils';
import { z } from 'zod';

export async function logout() {
  await signOut({ redirectTo: '/login' });
}

export async function deleteCar(id: number) {
  return executeAction(z.object({ id: z.number() }), { id }, async ({ id }) => {
      await CarService.deleteCar(id);
      return { success: true };
  }, { adminOnly: true });
}

export async function createCar(rawData: CarFormData) {
    return executeAction(carSchema, rawData, async (data) => {
        const car = await CarService.createCar(data);
        return { carId: car.id };
    });
}

export async function updateCar(id: number, rawData: CarFormData) {
    const result = await executeAction(carSchema, rawData, async (data) => {
        await CarService.updateCar(id, data);
        return { updated: true };
    });
    
    // We don't redirect here anymore to let client handle navigation or toast
    // But we revalidate
    if (result.success) {
        revalidatePath(`/cars/${id}`);
    }

    return result;
}

// --- EXPENSES ---

export async function addExpense(carId: number, rawData: ExpenseFormData) {
    return executeAction(expenseSchema, rawData, async (data, user) => {
        const expense = await ExpenseService.createExpense({
            xeMuaVaoId: carId,
            ...data,
            // If user is admin/manager, maybe auto-approve? For now, default logic applies.
            nguoiBaoGia: data.nguoiBaoGia || user.name || 'Staff'
        });
        revalidatePath(`/cars/${carId}`);
        return { expenseId: expense.id };
    });
}

export async function deleteExpense(expenseId: number, carId: number) {
    return executeAction(z.object({ id: z.number() }), { id: expenseId }, async ({ id }) => {
        await ExpenseService.deleteExpense(id);
        revalidatePath(`/cars/${carId}`);
        return { success: true };
    });
}

const approveExpenseSchema = z.object({
    id: z.number(),
    action: z.enum(['APPROVE', 'REJECT']),
    giaThucTe: z.number().optional(),
    lyDoTuChoi: z.string().optional(),
    nguoiDuyet: z.string().optional()
});

export async function reviewExpense(carId: number, rawData: z.infer<typeof approveExpenseSchema>) {
    return executeAction(approveExpenseSchema, rawData, async (data, user) => {
        await ExpenseService.approveExpense({
            id: data.id,
            action: data.action,
            giaThucTe: data.giaThucTe,
            lyDoTuChoi: data.lyDoTuChoi,
            nguoiDuyet: data.nguoiDuyet || user.name || 'Admin'
        });
        // We revalidate both expenses page and the specific car page
        revalidatePath(`/expenses`);
        revalidatePath(`/cars/${carId}`);
        return { success: true };
    }, { adminOnly: true }); // Only admin can approve/reject
}

// --- INVESTORS ---

export async function addInvestor(carId: number, rawData: InvestorFormData) {
    return executeAction(investorSchema, rawData, async (data) => {
        await InvestorService.createInvestor({
            xeMuaVaoId: carId,
            ...data,
            // Calculate percentage if not provided? Or just pass as is.
            tyLeGop: data.tyLeGop || 0
        });
        revalidatePath(`/cars/${carId}`);
        return { success: true };
    });
}

const addPaymentSchema = z.object({
    investorId: z.number(),
    soTien: z.number().min(1),
    ghiChu: z.string().optional(),
    hinhAnh: z.string().optional()
});

export async function addInvestorPayment(carId: number, rawData: z.infer<typeof addPaymentSchema>) {
    return executeAction(addPaymentSchema, rawData, async (data) => {
        await InvestorService.updateInvestor({
            id: data.investorId,
            action: 'ADD_PAYMENT',
            soTien: data.soTien,
            ghiChu: data.ghiChu,
            hinhAnh: data.hinhAnh
        });
        revalidatePath(`/cars/${carId}`);
        return { success: true };
    });
}

// Action to update investor status (e.g., mark as completed)
const updateInvestorStatusSchema = z.object({
    investorId: z.number(),
    action: z.literal('UPDATE_STATUS'),
    trangThaiMoi: z.string()
});

export async function updateInvestorStatusAction(carId: number, rawData: z.infer<typeof updateInvestorStatusSchema>) {
    return executeAction(updateInvestorStatusSchema, rawData, async (data) => {
        await InvestorService.updateInvestor({
            id: data.investorId,
            action: 'UPDATE_STATUS',
            trangThaiMoi: data.trangThaiMoi
        });
        revalidatePath(`/cars/${carId}`);
        return { success: true };
    });
}

// --- SELL CAR ---

const sellCarSchema = z.object({
    giaBan: z.number().min(1000000),
    khachMua: z.string().min(1),
    daThuDuTien: z.boolean().optional(),
    daGiaoXe: z.boolean().optional(),
});

export async function sellCarAction(carId: number, rawData: z.infer<typeof sellCarSchema>) {
    return executeAction(sellCarSchema, rawData, async (data, user) => {
        await CarService.sellCar({
            carId,
            giaBan: data.giaBan,
            khachMua: data.khachMua,
            daThuDuTien: data.daThuDuTien,
            daGiaoXe: data.daGiaoXe,
            nguoiThucHien: user.name || 'Admin'
        });
        revalidatePath(`/cars/${carId}`);
        return { success: true };
    });
}

// --- DOCS ---

const updateDocsSchema = z.object({
    trangThai: z.string(),
    noiGiuHoSo: z.string(),
    ngayHenRut: z.string().optional().nullable(), // Receive as string from form
    nguoiChiuTrachNhiem: z.string().optional()
});

export async function updateCarDocsAction(carId: number, rawData: z.infer<typeof updateDocsSchema>) {
    return executeAction(updateDocsSchema, rawData, async (data) => {
        await CarService.updateCarDocs(carId, {
            trangThai: data.trangThai,
            noiGiuHoSo: data.noiGiuHoSo,
            ngayHenRut: data.ngayHenRut ? new Date(data.ngayHenRut) : null,
            nguoiChiuTrachNhiem: data.nguoiChiuTrachNhiem
        });
        revalidatePath(`/cars/${carId}`);
        return { success: true };
    });
}

// Action to fetch notifications (for polling on client)
export async function fetchNotificationsAction(limit = 10, page = 1) {
    const { data, metadata } = await CarService.getNotifications(limit, page);
    return { success: true, data, metadata };
}


