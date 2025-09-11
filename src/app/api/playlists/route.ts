// src/app/api/playlists/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const playlists = await prisma.playlist.findMany({
      include: {
        user: { 
          select: {
            first_name: true,
          }
        },
        videos: {
          take: 1, 
          include: {
            video: {
              select: {
                thumbnail_url: true,
              }
            }
          },
          orderBy: {
            video: {
              display_order: 'asc'
            }
          }
        },
        _count: {
            select: { videos: true }
        }
      },
    });
    
    // Remap to include videoCount directly and simplify video data
    const publicPlaylists = playlists.map(p => ({
        id: p.id,
        name: p.name,
        user: p.user,
        videos: p.videos, // Frontend can extract thumbnail from this
        videoCount: p._count.videos
    }));

    return NextResponse.json(publicPlaylists);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error fetching playlists' }, { status: 500 });
  }
}
