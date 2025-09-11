// src/app/api/admin/shorts/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/adminAuth';

function createSlug(title: string) {
  if (!title) return '';
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export async function GET(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;
  
  try {
    const result = await prisma.short.findMany({
      include: { creator: true }
    });
    return NextResponse.json(result);
  } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Server error fetching shorts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;
  
  const { title, video_url, thumbnail_url, views, creator_id } = await request.json();
  try {
    const newShort = await prisma.short.create({
      data: { 
          title,
          slug: createSlug(title),
          video_url, 
          thumbnail_url, 
          views: views || '0', 
          creator_id: creator_id ? parseInt(creator_id, 10) : null
      }
    });
    return NextResponse.json(newShort, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
        return NextResponse.json({ message: 'A short with this title already exists.'}, { status: 409 });
    }
    return NextResponse.json({ message: 'Server error creating short' }, { status: 500 });
  }
}
