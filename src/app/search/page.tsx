'use client';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import { searchContent } from '@/lib/data';
import VideoCard from '@/components/video-card';
import ShortsCard from '@/components/shorts-card';
import { useEffect, useState, Suspense } from 'react';
import { Separator } from '@/components/ui/separator';
import { Film } from 'lucide-react';

function SearchComponent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAndFilter = async () => {
      if (!query) {
        setVideos([]);
        setShorts([]);
        return;
      }
      setIsLoading(true);
      try {
        const { videos: videoResults, shorts: shortResults } = await searchContent(query);
        setVideos(videoResults || []);
        setShorts(shortResults || []);
      } catch (error) {
        console.error("Failed to search content:", error);
        setVideos([]);
        setShorts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndFilter();
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-5">
          Search results for: <span className="text-primary">{query}</span>
        </h1>
        {isLoading ? (
            <p>Loading...</p>
        ) : videos.length === 0 && shorts.length === 0 ? (
           <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No results found matching your search.</p>
            </div>
        ) : (
          <div className="space-y-8">
            {videos.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold mb-4">Videos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                        {videos.map((video) => (
                        <VideoCard key={`vid-${video.id}`} video={video} />
                        ))}
                    </div>
                </div>
            )}
            
            {shorts.length > 0 && (
                 <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Film className="w-5 h-5"/>Shorts</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                        {shorts.map((short, index) => (
                          <ShortsCard key={`short-${short.id}`} short={short} index={index} />
                        ))}
                    </div>
                </div>
            )}
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
