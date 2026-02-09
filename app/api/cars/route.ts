import { NextResponse } from 'next/server';
import { carSchema } from '@/lib/schemas';
import { auth } from '@/auth';
import { createCar, getCars } from '@/lib/services/car.service';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;

  try {
    const cars = await getCars(status);
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate with Zod
    const validationResult = carSchema.safeParse(body);
    if (!validationResult.success) {
        return NextResponse.json({ 
            error: 'Validation failed', 
            details: validationResult.error.flatten() 
        }, { status: 400 });
    }

    const car = await createCar(validationResult.data);
    return NextResponse.json(car);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}
