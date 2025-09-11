// src/app/api/videos/[videoId]/like/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAuth, getUserIdFromRequest } from '@/lib/adminAuth';

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;
  const userId = await getUserIdFromRequest(request); // This can be null for guests

  try {
      const likesCount = await prisma.like.count({
          where: { video_id: parseInt(videoId) },
      });

      let userLike = null;
      if (userId) { // Only check for a like if the user is authenticated
        userLike = await prisma.like.findUnique({
          where: {
            user_id_video_id: {
              user_id: userId,
              video_id: parseInt(videoId),
            }
          }
        })
      }
      
      return NextResponse.json({ count: likesCount, isLiked: !!userLike });
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

  try {
    await prisma.like.create({
      data: {
        user_id: userId,
        video_id: parseInt(videoId),
      }
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(error);
    if(error.code === 'P2002'){
      return NextResponse.json({ message: 'Video already liked.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
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

  try {
    await prisma.like.delete({
      where: {
        user_id_video_id: {
          user_id: userId,
          video_id: parseInt(videoId),
        }
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(error);
    if(error.code === 'P2025'){
       return NextResponse.json({ message: 'Like not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
