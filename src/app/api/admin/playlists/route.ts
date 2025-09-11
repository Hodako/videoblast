// src/app/api/admin/playlists/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth, getUserIdFromRequest } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  try {
    const playlists = await prisma.playlist.findMany({
        include: {
            videos: {
                include: {
                    video: {
                      include: {
                        creator: true
                      }
                    }
                }
            },
            user: true
        }
    });
    return NextResponse.json(playlists);
  } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Server error fetching playlists' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authResponse = await adminAuth(request);
  if (authResponse) return authResponse;

  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ message: 'Could not identify user' }, { status: 401 });
  }

  const { name, videoIds = [] } = await request.json();
  try {
      const newPlaylist = await prisma.playlist.create({
          data: {
              name,
              user_id: userId,
              videos: {
                  create: videoIds.map((vId: number) => ({
                      video: { connect: { id: vId }}
                  }))
              }
          }
      });
      return NextResponse.json(newPlaylist, { status: 201 });
  } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Server error creating playlist' }, { status: 500 });
  }
}
