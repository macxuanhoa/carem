import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const car = await prisma.xeMuaVao.findUnique({
            where: { id: parseInt(id) },
            include: {
                hoSo: true,
                lichSu: { orderBy: { createdAt: 'desc' } },
                chiPhi: true,
                nguoiGopVon: true
            }
        });

        if (!car) {
            return new Response('Not found', { status: 404 });
        }

        return Response.json(car);
    } catch (error) {
        console.error('Error fetching car:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { hinhAnh } = body;

        if (!Array.isArray(hinhAnh)) {
            return new Response('Invalid data', { status: 400 });
        }

        await prisma.xeMuaVao.update({
            where: { id: parseInt(id) },
            data: {
                hinhAnh,
            },
        });

        return new Response('Updated', { status: 200 });
    } catch (error) {
        console.error('Error updating car images:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
