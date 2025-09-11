// src/app/api/videos/[videoId]/comments/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAuth, getUserIdFromRequest } from '@/lib/adminAuth';

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;
  try {
    const comments = await prisma.comment.findMany({
      where: { video_id: parseInt(videoId) },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        }
      },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  const authCheckResponse = await checkAuth(request);
  if (authCheckResponse) return authCheckResponse;

  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }
  
  const { videoId } = params;
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ message: 'Comment text is required' }, { status: 400 });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        text,
        user_id: userId,
        video_id: parseInt(videoId),
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        }
      }
    });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
