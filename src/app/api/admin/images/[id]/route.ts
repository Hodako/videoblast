// src/app/api/admin/images/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/adminAuth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;
  
  const { id } = params;
  try {
    const imageId = parseInt(id, 10);
    if(isNaN(imageId)) return NextResponse.json({ message: 'Invalid image ID.' }, { status: 400 });
    await prisma.image.delete({ where: { id: imageId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error deleting image' }, { status: 500 });
  }
}
