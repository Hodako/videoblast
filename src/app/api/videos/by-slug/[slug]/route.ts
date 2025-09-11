// src/app/api/videos/by-slug/[slug]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  try {
    const video = await prisma.video.findUnique({
        where: { slug },
        include: {
            creator: true,
            categories: {
                include: {
                    category: true
                }
            }
        }
    });

    if (!video) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }
    // Increment views - should not await to avoid blocking response
    prisma.video.update({
      where: { id: video.id },
      data: { views: { increment: 1 } },
    }).catch(console.error);

    return NextResponse.json(video);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
