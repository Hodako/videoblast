// src/app/api/admin/categories/[id]/route.ts
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
  const { name } = await request.json();
  if (!name || name.trim() === '') {
      return NextResponse.json({ message: 'Category name cannot be empty.'}, { status: 400 });
  }
  try {
      const categoryId = parseInt(id, 10);
      if(isNaN(categoryId)) return NextResponse.json({ message: 'Invalid category ID.' }, { status: 400 });
      const updated = await prisma.category.update({ where: { id: categoryId }, data: { name }});
      return NextResponse.json(updated);
  } catch (error: any) {
       if (error.code === 'P2002') {
          return NextResponse.json({ message: 'A category with this name already exists.'}, { status: 409 });
      }
      return NextResponse.json({ message: 'Server error updating category' }, { status: 500 });
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
      const categoryId = parseInt(id, 10);
      if(isNaN(categoryId)) return NextResponse.json({ message: 'Invalid category ID.' }, { status: 400 });
      await prisma.category.delete({ where: { id: categoryId } });
      return new NextResponse(null, { status: 204 });
  } catch (error) {
      return NextResponse.json({ message: 'Server error deleting category' }, { status: 500 });
  }
}
