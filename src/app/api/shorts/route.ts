
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const shorts = await prisma.short.findMany();
  return NextResponse.json(shorts);
}
