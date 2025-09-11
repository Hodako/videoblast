// src/app/api/admin/creators/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/adminAuth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  const { id } = params;
  const { name, image_url, description } = await request.json();
   if (!name || name.trim() === '') {
      return NextResponse.json({ message: 'Creator name cannot be empty.'}, { status: 400 });
  }
  try {
      const creatorId = parseInt(id, 10);
      if(isNaN(creatorId)) return NextResponse.json({ message: 'Invalid creator ID.' }, { status: 400 });
      const updated = await prisma.creator.update({ where: { id: creatorId }, data: { name, image_url, description }});
      return NextResponse.json(updated);
  } catch (error: any) {
      if (error.code === 'P2002') {
          return NextResponse.json({ message: 'A creator with this name already exists.'}, { status: 409 });
      }
      return NextResponse.json({ message: 'Server error updating creator' }, { status: 500 });
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
      const creatorId = parseInt(id, 10);
      if(isNaN(creatorId)) return NextResponse.json({ message: 'Invalid creator ID.' }, { status: 400 });
      await prisma.creator.delete({ where: { id: creatorId } });
      return new NextResponse(null, { status: 204 });
  } catch (error) {
      return NextResponse.json({ message: 'Server error deleting creator' }, { status: 500 });
  }
}
