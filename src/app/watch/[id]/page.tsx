// src/app/watch/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import { videos } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Share2, Download } from 'lucide-react';
import VideoCard from '@/components/video-card';

export default function WatchPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string, 10) : -1;
  const video = videos[id];
  const recommendedVideos = videos.filter((_, index) => index !== id);

  if (id === -1 || !video) {
    return <div>Video not found</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-col lg:flex-row p-5 gap-5">
        <div className="flex-1">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={video.videoUrl}
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>
          <div className="py-4">
            <h1 className="text-2xl font-bold">{video.title}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${video.subtitle}`} />
                  <AvatarFallback>{video.subtitle.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{video.subtitle}</p>
                  <p className="text-sm text-muted-foreground">1.2M subscribers</p>
                </div>
                <Button variant="outline">Subscribe</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost">
                  <ThumbsUp className="mr-2 h-4 w-4" /> 15K
                </Button>
                <Button variant="ghost">
                  <ThumbsDown className="mr-2 h-4 w-4" /> 1K
                </Button>
                <Button variant="ghost">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <Button variant="ghost">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>
            <div className="mt-4 bg-muted p-4 rounded-lg">
              <p className="font-semibold">{video.views} &bull; {video.uploaded}</p>
              <p className="text-sm mt-2">{video.description}</p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[350px] shrink-0">
          <h2 className="text-xl font-bold mb-4">Up next</h2>
          <div className="space-y-4">
            {recommendedVideos.map((recVideo, index) => (
              <VideoCard key={index} video={recVideo} index={videos.indexOf(recVideo)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
