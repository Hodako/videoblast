// src/app/api/admin/videos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth, getUserIdFromRequest } from '@/lib/adminAuth';

function createSlug(title: string) {
  if (!title) return '';
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export async function GET(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  try {
      const videos = await prisma.video.findMany({
          include: {
              categories: {
                  select: {
                      category: true
                  }
              },
              creator: true,
          },
          orderBy: {
              display_order: 'asc'
          }
      });
       const videosWithCategoryIds = videos.map(video => ({
          ...video,
          categoryIds: video.categories.map(vc => vc.category.id)
      }));
      return NextResponse.json(videosWithCategoryIds);
  } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Server error fetching videos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;
  
  const uploaderId = await getUserIdFromRequest(request);
  if (!uploaderId) {
    return NextResponse.json({ message: 'Could not determine uploader.'}, { status: 401 });
  }

  const { title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, categoryIds = [], type, creator_id } = await request.json();
  
  if(!title || !video_url) {
    return NextResponse.json({ message: 'Title and Video URL are required' }, { status: 400 });
  }
  
  try {
    const newVideo = await prisma.video.create({
        data: {
            title, 
            slug: createSlug(title),
            description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views: parseInt(views, 10) || 0, uploaded, uploader_id: uploaderId, type,
            creator_id: creator_id ? parseInt(creator_id, 10) : undefined,
            categories: {
                create: categoryIds.map((id: number) => ({
                    category: {
                        connect: { id: id }
                    }
                }))
            }
        }
    });
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error: any) {
      console.error('Failed to create video:', error);
      if (error.code === 'P2002') {
        return NextResponse.json({ message: 'A video with this title already exists. Please choose a unique title.'}, { status: 409 });
      }
      return NextResponse.json({ message: 'Server error creating video' }, { status: 500 });
  }
}
