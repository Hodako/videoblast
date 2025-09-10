// src/app/api/stream/[videoId]/route.ts
import { prisma } from '@/backend/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

const CHUNK_SIZE = 10 ** 6; // 1MB

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;

  if (!videoId || isNaN(parseInt(videoId))) {
    return new NextResponse('Invalid video ID', { status: 400 });
  }

  try {
    const video = await prisma.video.findUnique({
      where: { id: parseInt(videoId) },
    });

    if (!video || !video.video_url) {
      return new NextResponse('Video not found', { status: 404 });
    }

    const videoUrl = video.video_url;

    // 1. Get video size by making a HEAD request first
    const headResponse = await fetch(videoUrl, { method: 'HEAD' });
    if (!headResponse.ok) {
        return new NextResponse('Could not fetch video metadata', { status: 500 });
    }
    const fileSize = Number(headResponse.headers.get('content-length'));

    if (isNaN(fileSize)) {
        return new NextResponse('Could not determine video size', { status: 500 });
    }

    // 2. Parse the Range header from the client's request
    const range = req.headers.get('range');
    
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE, fileSize - 1);
      const chunkSize = (end - start) + 1;

      // 3. Fetch only the requested chunk from the source URL
      const videoResponse = await fetch(videoUrl, {
        headers: {
            'Range': `bytes=${start}-${end}`
        }
      });
      
      if (!videoResponse.ok || !videoResponse.body) {
        return new NextResponse('Failed to fetch video chunk', { status: 500 });
      }

      // 4. Stream the chunk back to the client with a 206 Partial Content status
      const headers = new Headers();
      headers.set('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Content-Length', chunkSize.toString());
      headers.set('Content-Type', 'video/mp4');

      return new NextResponse(videoResponse.body, {
        status: 206, // Partial Content
        headers,
      });

    } else {
        // 5. If no range is requested, send the initial part of the video
        const headers = new Headers();
        headers.set('Content-Length', fileSize.toString());
        headers.set('Content-Type', 'video/mp4');
        headers.set('Accept-Ranges', 'bytes'); // Important to tell the browser we support seeking

        // We can start by sending a smaller chunk or just the headers
        // For simplicity, we can let the browser decide and handle the first request
        // by just indicating we accept ranges. Often the browser will then make a ranged request.
        // Or we can stream the whole thing if we want.
        const initialResponse = await fetch(videoUrl);
        if (!initialResponse.ok || !initialResponse.body) {
            return new NextResponse('Failed to fetch video', { status: 500 });
        }
        
        return new NextResponse(initialResponse.body, {
            status: 200, // OK
            headers,
        });
    }
    
  } catch (error) {
    console.error('Streaming error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
