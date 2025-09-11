// src/app/api/creators/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const creators = await prisma.creator.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(creators);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
