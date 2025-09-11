// src/app/api/admin/videos/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/adminAuth';

function createSlug(title: string) {
  if (!title) return '';
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  const { id } = params;
  const { title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, categoryIds = [], type, creator_id } = await request.json();

  if(!title || !video_url) {
    return NextResponse.json({ message: 'Title and Video URL are required' }, { status: 400 });
  }
  
  try {
    const videoId = parseInt(id, 10);
    if(isNaN(videoId)) return NextResponse.json({ message: 'Invalid video ID.' }, { status: 400 });

    await prisma.$transaction(async (tx) => {
      await tx.videoCategory.deleteMany({
        where: { video_id: videoId }
      });

      const updatedVideo = await tx.video.update({
        where: { id: videoId },
        data: {
            title, 
            slug: createSlug(title),
            description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views: parseInt(views, 10) || 0, uploaded, type,
            creator_id: creator_id ? parseInt(creator_id, 10) : null,
            categories: {
                create: categoryIds.map((catId: number) => ({
                    category: {
                        connect: { id: catId }
                    }
                }))
            }
        }
      });
      return NextResponse.json(updatedVideo);
    });
     // This part is tricky as you can't return from inside a transaction callback to the outer function's caller directly.
     // We will rely on the transaction throwing an error on failure, and if it completes, we send a success response.
     // The updated video data might need to be re-fetched if the client needs it.
    return NextResponse.json({ message: "Video updated successfully."});

  } catch (error: any) {
      console.error('Failed to update video:', error);
      if (error.code === 'P2002') {
        return NextResponse.json({ message: 'A video with this title already exists. Please choose a unique title.'}, { status: 409 });
      }
      return NextResponse.json({ message: 'Server error updating video' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;
  
  const { id } = params;
  try {
    const videoId = parseInt(id, 10);
    if(isNaN(videoId)) return NextResponse.json({ message: 'Invalid video ID.' }, { status: 400 });
    // Thanks to `onDelete: Cascade` in schema, related `VideoCategory`, `Like`, `Comment` records will be deleted.
    await prisma.video.delete({ where: { id: videoId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error deleting video' }, { status: 500 });
  }
}
