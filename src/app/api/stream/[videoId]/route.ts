// src/app/api/stream/[videoId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// This is a proxy route. It will fetch the video from the actual backend
// to hide the source URL from the client.
// NOTE: This approach is not ideal for production as it puts a lot of load on your Next.js server.
// A better approach would be to use signed URLs from a cloud storage provider (like S3 or GCS).

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
    const { videoId } = params;

    // The getApiUrl function will resolve to your separate backend server
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
    const videoUrl = `${API_URL}/videos/stream-source/${videoId}`; // A new backend endpoint to get the real URL

    try {
        const videoRes = await fetch(videoUrl);
        if (!videoRes.ok) {
            return new NextResponse('Video source not found', { status: 404 });
        }
        const { sourceUrl } = await videoRes.json();
        
        // Redirect the client to the actual video source.
        // This is simpler than proxying the bytes.
        // For more security, the `sourceUrl` should be a temporary, signed URL.
        return NextResponse.redirect(sourceUrl);

    } catch (error) {
        console.error('Streaming proxy error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
