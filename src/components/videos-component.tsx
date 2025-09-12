// src/components/videos-component.tsx
'use client';
import VideoCard from '@/components/video-card';
import { getVideos } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VIDEOS_PER_PAGE = 20;

// This is now a CLIENT component to fetch data on the client side.
// We can't rely on server-side fetching here easily without a full backend integration
// for pagination, which is beyond the current scope.
// This is a practical approach for now.
import { useEffect, useState } from 'react';

export default function VideosComponent({ currentPage }: { currentPage: number}) {
  const [allVideos, setAllVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVids = async () => {
        setIsLoading(true);
        try {
            const data = await getVideos({ sortBy: 'popular' });
            setAllVideos(data);
        } catch (error) => {
            console.error("Failed to fetch videos:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchVids();
  }, []);
  

  const totalPages = Math.ceil(allVideos.length / VIDEOS_PER_PAGE);
  const paginatedVideos = allVideos.slice((currentPage - 1) * VIDEOS_PER_PAGE, currentPage * VIDEOS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    if (currentPage > 2) pages.push(1);
    if (currentPage > 3) pages.push('...');

    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
       if(!pages.includes(i)) pages.push(i);
    }
    
    if (currentPage < totalPages - 2) pages.push('...');
    if (currentPage < totalPages - 1) pages.push(totalPages);


    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <Button asChild variant="outline" size="icon" disabled={currentPage === 1}>
          <Link href={currentPage > 1 ? `/videos?page=${currentPage - 1}` : '#'}><ChevronLeft /></Link>
        </Button>
        {pages.map((p, i) => (
          typeof p === 'number' ? (
            <Button asChild key={i} variant={p === currentPage ? 'default' : 'outline'}>
                <Link href={`/videos?page=${p}`}>{p}</Link>
            </Button>
          ) : (
            <span key={i} className="px-4 py-2">{p}</span>
          )
        ))}
        <Button asChild variant="outline" size="icon" disabled={currentPage === totalPages}>
          <Link href={currentPage < totalPages ? `/videos?page=${currentPage + 1}` : '#'}><ChevronRight /></Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {paginatedVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      {renderPagination()}
    </>
  );
}
