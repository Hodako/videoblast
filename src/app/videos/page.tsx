// src/app/videos/page.tsx
import Header from '@/components/header';
import { videos } from '@/lib/data';
import VideoCard from '@/components/video-card';

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5">
        <h1 className="text-3xl font-bold mb-8">All Videos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {videos.map((video, index) => (
            <VideoCard key={index} video={video} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
