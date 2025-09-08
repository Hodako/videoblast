// src/app/videos/page.tsx
'use client';

import Header from '@/components/header';
import VideoCard from '@/components/video-card';
import { getVideos } from '@/lib/data';
import { useEffect, useState } from 'react';

export default function VideosPage() {
  const [allVideos, setAllVideos] = useState([]);
  
  useEffect(() => {
    async function loadVideos() {
      const videosData = await getVideos();
      setAllVideos(videosData);
    }
    loadVideos();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5">
        <h1 className="text-3xl font-bold mb-8">All Videos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {allVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </main>
    </div>
  );
}
