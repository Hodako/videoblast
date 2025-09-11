// src/app/api/videos/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ videos: [], shorts: []});
  }
  try {
    const videos = await prisma.video.findMany({
      where: {
        OR: [
          { title: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } },
          { tags: { has: q as string } }
        ],
      },
       include: {
        creator: true
      }
    });

    const shorts = await prisma.short.findMany({
      where: {
         OR: [
          { title: { contains: q as string, mode: 'insensitive' } },
        ],
      },
      include: {
        creator: true
      }
    })
    return NextResponse.json({ videos, shorts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
