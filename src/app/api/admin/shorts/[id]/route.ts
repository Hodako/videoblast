// src/app/api/admin/shorts/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/adminAuth';

function createSlug(title: string) {
  if (!title) return '';
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  const { id } = params;
  const { title, video_url, thumbnail_url, creator_id } = await request.json();
  try {
    const shortId = parseInt(id, 10);
    if(isNaN(shortId)) return NextResponse.json({ message: 'Invalid short ID.' }, { status: 400 });
    const updatedShort = await prisma.short.update({
      where: { id: shortId },
      data: {
        title,
        slug: createSlug(title),
        video_url,
        thumbnail_url,
        creator_id: creator_id ? parseInt(creator_id, 10) : null
      }
    });
    return NextResponse.json(updatedShort);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
        return NextResponse.json({ message: 'A short with this title already exists.'}, { status: 409 });
    }
    return NextResponse.json({ message: 'Server error updating short' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;
  
  const { id } = params;
  try {
    const shortId = parseInt(id, 10);
    if(isNaN(shortId)) return NextResponse.json({ message: 'Invalid short ID.' }, { status: 400 });
    await prisma.short.delete({ where: { id: shortId }});
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error deleting short' }, { status: 500 });
  }
}
