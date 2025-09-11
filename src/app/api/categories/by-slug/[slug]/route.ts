// src/app/api/categories/by-slug/[slug]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  try {
    // This assumes slugs are unique, which should be enforced by the creation logic
    const category = await prisma.category.findFirst({
      where: {
        name: {
          // A simple slug-like transformation. For production, you'd save the slug in the DB.
          equals: slug.replace(/-/g, ' '),
          mode: 'insensitive'
        }
      }
    });

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
