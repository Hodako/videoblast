// src/app/api/shorts/by-slug/[slug]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
    const { slug } = params;
    try {
        const short = await prisma.short.findUnique({
            where: { slug },
            include: {
                creator: true,
            }
        });

        if (!short) {
            return NextResponse.json({ message: 'Short not found' }, { status: 404 });
        }
        return NextResponse.json(short);

    } catch(error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
