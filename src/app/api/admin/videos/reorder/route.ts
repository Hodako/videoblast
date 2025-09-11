// src/app/api/admin/videos/reorder/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/adminAuth';

export async function PUT(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  const videos: { id: number, order: number }[] = await request.json();
  if(!Array.isArray(videos)) return NextResponse.json({ message: 'Request body must be an array.' }, { status: 400 });
  try {
    await prisma.$transaction(
      videos.map(video => {
        if(typeof video.id !== 'number' || typeof video.order !== 'number') {
            throw new Error('Invalid video data in array.');
        }
        return prisma.video.update({
          where: { id: video.id },
          data: { display_order: video.order }
        })
      })
    );
    return NextResponse.json({ message: "Video order updated successfully."});
  } catch (error) {
    console.error('Failed to reorder videos:', error);
    return NextResponse.json({ message: 'Server error reordering videos' }, { status: 500 });
  }
}
