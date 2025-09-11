// src/app/api/videos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const types = searchParams.getAll('type');
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const sortBy = searchParams.get('sortBy');
  
  const where: any = {};
  let orderBy: any = { uploaded: 'desc' }; // Default to recent
  
  if (types && types.length > 0) {
    where.type = { in: types };
  }
  if (category) {
      where.categories = { some: { category: { name: { equals: category.replace(/-/g, ' '), mode: 'insensitive' } } } };
  }
  if (tag) {
      where.tags = { has: tag };
  }

  if (sortBy === 'popular') {
      orderBy = { views: 'desc' };
  } else if (sortBy === 'relevance' && !tag && !category) {
     orderBy = { display_order: 'asc' };
  }

  try {
    const videos = await prisma.video.findMany({
      where,
      include: {
        creator: true,
        categories: { include: { category: true }}
      },
      orderBy,
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
