// src/app/api/settings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Public route for site settings
export async function GET() {
  try {
    const result = await prisma.siteSetting.findUnique({where: { key: 'siteSettings' }});
    if (result) {
      return NextResponse.json(result.value);
    } else {
      return NextResponse.json({}); // Return empty object if no settings found
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error fetching settings' }, { status: 500 });
  }
}
