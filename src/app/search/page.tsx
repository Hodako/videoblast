'use client';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import { videos } from '@/lib/data';
import VideoCard from '@/components/video-card';
import { useEffect, useState } from 'react';

type Video = typeof videos[0];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const results = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(lowercasedQuery) ||
          video.description.toLowerCase().includes(lowercasedQuery) ||
          video.subtitle.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredVideos(results);
    } else {
      setFilteredVideos([]);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5">
        <h1 className="text-2xl font-bold mb-5">
          Search results for: <span className="text-primary">{query}</span>
        </h1>
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {filteredVideos.map((video, index) => (
              <VideoCard key={index} video={video} index={videos.indexOf(video)} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No videos found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
