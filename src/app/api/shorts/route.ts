// src/app/api/shorts/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const shorts = await prisma.short.findMany({
      include: { creator: true }
    });
    return NextResponse.json(shorts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
