// src/app/api/admin/creators/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  try {
    const creators = await prisma.creator.findMany({ orderBy: { name: 'asc' }});
    return NextResponse.json(creators);
  } catch (error) {
    return NextResponse.json({ message: 'Server error fetching creators' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  const { name, image_url, description } = await request.json();
   if (!name || name.trim() === '') {
      return NextResponse.json({ message: 'Creator name cannot be empty.'}, { status: 400 });
  }
  try {
      const newCreator = await prisma.creator.create({ data: { name, image_url, description } });
      return NextResponse.json(newCreator, { status: 201 });
  } catch (error: any) {
      if (error.code === 'P2002') {
          return NextResponse.json({ message: 'A creator with this name already exists.'}, { status: 409 });
      }
      return NextResponse.json({ message: 'Server error creating creator' }, { status: 500 });
  }
}
