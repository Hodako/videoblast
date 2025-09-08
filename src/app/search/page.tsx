'use client';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import { getVideos } from '@/lib/data';
import VideoCard from '@/components/video-card';
import { useEffect, useState, Suspense } from 'react';

function SearchComponent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAndFilter = async () => {
      if (!query) {
        setFilteredVideos([]);
        return;
      }
      setIsLoading(true);
      const videosData = await getVideos();
      const lowercasedQuery = query.toLowerCase();
      const results = videosData.filter(
        (video) =>
          video.title.toLowerCase().includes(lowercasedQuery) ||
          video.description.toLowerCase().includes(lowercasedQuery) ||
          video.subtitle.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredVideos(results);
      setIsLoading(false);
    };
    fetchAndFilter();
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5">
        <h1 className="text-2xl font-bold mb-5">
          Search results for: <span className="text-primary">{query}</span>
        </h1>
        {isLoading ? (
            <p>Loading...</p>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
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


export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <SearchComponent />
        </Suspense>
    )
}
