// src/app/api/admin/images/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  try {
    const result = await prisma.image.findMany();
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error fetching images' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  const { title, image_url } = await request.json();
  try {
    const newImage = await prisma.image.create({
      data: { title, image_url }
    });
    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error creating image' }, { status: 500 });
  }
}
