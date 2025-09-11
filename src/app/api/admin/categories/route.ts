// src/app/api/admin/categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }});
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: 'Server error fetching categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  const { name } = await request.json();
  if (!name || name.trim() === '') {
      return NextResponse.json({ message: 'Category name cannot be empty.'}, { status: 400 });
  }
  try {
      const newCategory = await prisma.category.create({ data: { name } });
      return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
      if (error.code === 'P2002') {
          return NextResponse.json({ message: 'A category with this name already exists.'}, { status: 409 });
      }
      return NextResponse.json({ message: 'Server error creating category' }, { status: 500 });
  }
}
