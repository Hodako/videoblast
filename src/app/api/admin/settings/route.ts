// src/app/api/admin/settings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/adminAuth';

// This is an admin route, so it requires auth
export async function GET(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;
  
  try {
    const result = await prisma.siteSetting.findUnique({where: { key: 'siteSettings' }});
    if (result) {
      return NextResponse.json(result.value);
    } else {
      return NextResponse.json({});
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error fetching settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  const { key, value } = await request.json();
  if (key !== 'siteSettings') {
    return NextResponse.json({ message: 'Invalid settings key' }, { status: 400 });
  }
  try {
    const updated = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    return NextResponse.json(updated.value);
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ message: `Server error updating settings: ${error.message}` }, { status: 500 });
  }
}
