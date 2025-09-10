// src/app/api/stream/[videoId]/route.ts
import { prisma } from '@/backend/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

// This function handles GET requests to /api/stream/[videoId]
export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;

  if (!videoId || isNaN(parseInt(videoId))) {
    return new NextResponse('Invalid video ID', { status: 400 });
  }

  try {
    // 1. Fetch video details from the database
    const video = await prisma.video.findUnique({
      where: { id: parseInt(videoId) },
    });

    if (!video || !video.video_url) {
      return new NextResponse('Video not found', { status: 404 });
    }

    // 2. Fetch the actual video file from its source URL
    const videoUrl = video.video_url;
    const response = await fetch(videoUrl);

    if (!response.ok || !response.body) {
      return new NextResponse('Failed to fetch video stream', { status: 500 });
    }

    // 3. Stream the video content back to the client
    const headers = new Headers(response.headers);
    headers.set('Content-Type', 'video/mp4');

    // The 'body' of a fetch response is already a ReadableStream
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
    
  } catch (error) {
    console.error('Streaming error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
