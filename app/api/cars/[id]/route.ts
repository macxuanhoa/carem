import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCarById, updateCar } from '@/lib/services/car.service';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const resolvedParams = await params;
        const id = Number(resolvedParams.id);
        
        if (!id || isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const car = await getCarById(id);

        if (!car) {
            return NextResponse.json({ error: 'Car not found' }, { status: 404 });
        }

        return NextResponse.json(car);
    } catch (error) {
        console.error('Fetch car error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const resolvedParams = await params;
        const id = Number(resolvedParams.id);
        const body = await request.json();

        if (!id || isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        // Destructure body to separate Car fields and Docs fields
        const {
            hoSo_trangThai,
            hoSo_noiGiu,
            hoSo_ngayHen,
            hoSo_nguoiPhuTrach,
            ...carData
        } = body;

        // Clean up numeric fields if present in carData
        if (carData.soTienCoc) carData.soTienCoc = Number(carData.soTienCoc);
        if (carData.tongGiaMua) carData.tongGiaMua = Number(carData.tongGiaMua);
        if (carData.namSanXuat) carData.namSanXuat = Number(carData.namSanXuat);
        if (carData.tinhTrang) carData.tinhTrang = Number(carData.tinhTrang);
        
        // Handle Date fields
        if (carData.ngayHenGiao) carData.ngayHenGiao = new Date(carData.ngayHenGiao);
        if (carData.ngayCoc) carData.ngayCoc = new Date(carData.ngayCoc);

        // We can reuse updateCar from service but it expects CarFormData which is stricter
        // Or we can create a more flexible update function in service.
        // For now, let's move the flexible update logic to service as `updateCarFlexible` or similar.
        // But wait, `updateCar` in service is already doing complex transaction logic.
        // The PATCH here seems to be handling partial updates which might not fit perfectly with `updateCar` (which takes full FormData).
        
        // Let's create a partial update function in service.
        
        // REFACTOR PLAN:
        // 1. Move the transaction logic to service as `updateCarPartial`.
        // 2. Call it here.
        
        const updatedCar = await updateCarPartial(id, carData, {
            hoSo_trangThai,
            hoSo_noiGiu,
            hoSo_ngayHen,
            hoSo_nguoiPhuTrach
        });

        return NextResponse.json(updatedCar);
    } catch (error) {
        console.error('Update car error:', error);
        return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
    }
}