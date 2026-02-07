import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = Number(resolvedParams.id);
        
        if (!id || isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const car = await prisma.xeMuaVao.findUnique({
            where: { id },
            include: {
                hoSo: true,
                banRa: true,
                gopVon: true,
                chiPhi: true,
                lichSu: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

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

        const updatedCar = await prisma.$transaction(async (tx) => {
            // Update Car Info
            const car = await tx.xeMuaVao.update({
                where: { id },
                data: carData,
            });

            // Update Docs Info if provided
            if (hoSo_trangThai || hoSo_noiGiu || hoSo_ngayHen || hoSo_nguoiPhuTrach) {
                // Check if hoSo exists
                const existingHoSo = await tx.hoSoXe.findUnique({
                    where: { xeMuaVaoId: id }
                });

                const hoSoData = {
                    trangThai: hoSo_trangThai,
                    noiGiuHoSo: hoSo_noiGiu,
                    ngayHenRut: hoSo_ngayHen ? new Date(hoSo_ngayHen) : null,
                    nguoiChiuTrachNhiem: hoSo_nguoiPhuTrach
                };

                if (existingHoSo) {
                    await tx.hoSoXe.update({
                        where: { xeMuaVaoId: id },
                        data: hoSoData
                    });
                } else {
                    await tx.hoSoXe.create({
                        data: {
                            xeMuaVaoId: id,
                            ...hoSoData,
                            trangThai: hoSoData.trangThai || 'CHUA_CAN',
                            noiGiuHoSo: hoSoData.noiGiuHoSo || 'CHU_CU'
                        }
                    });
                }
            }

            return car;
        });

        return NextResponse.json(updatedCar);
    } catch (error) {
        console.error('Update car error:', error);
        return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
    }
}