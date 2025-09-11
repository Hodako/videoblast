// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  try {
    const videoCount = await prisma.video.count();
    const shortCount = await prisma.short.count();
    const creatorCount = await prisma.creator.count();
    const totalViewsResult = await prisma.video.aggregate({ _sum: { views: true } });
    const totalViews = totalViewsResult._sum.views || 0;
    
    return NextResponse.json({
      totalVideos: videoCount.toString(),
      totalShorts: shortCount.toString(),
      totalCreators: creatorCount.toString(),
      totalViews: totalViews.toLocaleString(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error fetching stats' }, { status: 500 });
  }
}
