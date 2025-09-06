
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const videos = await prisma.video.findMany();
  return NextResponse.json(videos);
}
