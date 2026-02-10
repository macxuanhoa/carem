'use server';

import { redirect } from 'next/navigation';
import { carSchema, CarFormData } from '@/lib/schemas';
import { signOut, auth } from '@/auth';
import * as CarService from '@/lib/services/car.service';

export async function logout() {
  await signOut({ redirectTo: '/login' });
}

export async function deleteCar(id: number) {
  const session = await auth();
  const user = session?.user as any; // Temporary workaround for TS error until module augmentation is fully picked up
  if (user?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Chỉ có Admin mới được xóa xe.');
  }

  try {
    await CarService.deleteCar(id);
  } catch (error: any) {
    console.error('Failed to delete car:', error);
    throw new Error(error.message || 'Failed to delete car');
  }
}

export async function createCar(rawData: CarFormData) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized: Vui lòng đăng nhập để thêm xe.');
    }

    const validationResult = carSchema.safeParse(rawData);
    
    if (!validationResult.success) {
        console.error('Validation Failed:', validationResult.error.flatten());
        throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }

    try {
        const car = await CarService.createCar(validationResult.data);
        return { success: true, carId: car.id };
    } catch (error) {
        console.error('Failed to create car:', error);
        throw new Error('Failed to create car. Please try again.');
    }
}

export async function updateCar(id: number, rawData: CarFormData) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized: Vui lòng đăng nhập.');
    }
    
    const validationResult = carSchema.safeParse(rawData);
    
    if (!validationResult.success) {
        console.error('Validation Failed:', validationResult.error.flatten());
        throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }

    try {
        await CarService.updateCar(id, validationResult.data);
    } catch (error) {
        console.error('Failed to update car:', error);
        throw new Error('Failed to update car');
    }

    redirect(`/cars/${id}`);
}
