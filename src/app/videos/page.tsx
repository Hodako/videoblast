// src/app/videos/page.tsx
'use client';

import Header from '@/components/header';
import VideoCard from '@/components/video-card';
import { getVideos } from '@/lib/data';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const VIDEOS_PER_PAGE = 20;

function VideosComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allVideos, setAllVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
  
  useEffect(() => {
    async function loadVideos() {
      setIsLoading(true);
      try {
        const videosData = await getVideos({ sortBy: 'popular' });
        setAllVideos(videosData);
      } catch (error) {
        console.error("Failed to load videos:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadVideos();
  }, []);

  const totalPages = Math.ceil(allVideos.length / VIDEOS_PER_PAGE);
  const paginatedVideos = allVideos.slice((page - 1) * VIDEOS_PER_PAGE, page * VIDEOS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`/videos?page=${newPage}`);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    // Always show first page
    if (page > 2) pages.push(1);
    if (page > 3) pages.push('...');

    // Show pages around current
    for (let i = Math.max(1, page - 1); i <= Math.min(totalPages, page + 1); i++) {
       if(!pages.includes(i)) pages.push(i);
    }
    
    // Always show last page
    if (page < totalPages - 2) pages.push('...');
    if (page < totalPages - 1) pages.push(totalPages);


    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <Button variant="outline" size="icon" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          <ChevronLeft />
        </Button>
        {pages.map((p, i) => (
          typeof p === 'number' ? (
            <Button key={i} variant={p === page ? 'default' : 'outline'} onClick={() => handlePageChange(p)}>{p}</Button>
          ) : (
            <span key={i} className="px-4 py-2">{p}</span>
          )
        ))}
        <Button variant="outline" size="icon" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          <ChevronRight />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">All Videos</h1>
        {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {[...Array(VIDEOS_PER_PAGE)].map((_, i) => (
                 <div key={i} className="group">
                    <Skeleton className="w-full aspect-video rounded-lg" />
                    <div className="flex gap-4 pt-2">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="w-full space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                </div>
              ))}
            </div>
        ): (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {paginatedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
              {renderPagination()}
            </>
        )}
      </main>
    </div>
  );
}

export default function VideosPage() {
    return (
        <Suspense fallback={<div>Loading videos...</div>}>
            <VideosComponent />
        </Suspense>
    )
}
