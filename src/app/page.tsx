'use client';
import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/header';
import PromoBanner from '@/components/promo-banner';
import SidebarContent from '@/components/sidebar-content';
import MainContent from '@/components/main-content';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';
import Link from 'next/link';
import { useWindowScroll } from 'react-use';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { getVideos, getShorts } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { y } = useWindowScroll();
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastY, setLastY] = useState(0);
  const isMobile = useIsMobile();
  const [allVideos, setAllVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [filters, setFilters] = useState({ types: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (y > lastY) {
      setIsScrollingDown(true);
    } else {
      setIsScrollingDown(false);
    }
    setLastY(y);
  }, [y, lastY]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const videosData = await getVideos();
        const shortsData = await getShorts();
        setAllVideos(videosData);
        setShorts(shortsData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        // Handle the error appropriately, maybe show a toast
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const filteredVideos = useMemo(() => {
    if (!allVideos) return [];
    return allVideos.filter(video => {
      if (filters.types.length > 0 && !filters.types.includes(video.type)) {
        return false;
      }
      return true;
    });
  }, [allVideos, filters]);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <PromoBanner />
      <div className="flex flex-col md:flex-row">
        <aside className="w-full shrink-0 md:w-[250px] bg-card p-5 border-r-0 md:border-r border-border md:order-1 order-2">
          <SidebarContent onFilterChange={handleFilterChange} />
        </aside>
        <main className="flex-1 p-5 md:order-2 order-1">
          {isLoading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
              </div>
               <Skeleton className="h-48 w-full" />
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
              </div>
            </div>
          ) : (
            <MainContent videos={filteredVideos} shorts={shorts} />
          )}
        </main>
      </div>

       {isMobile && (
         <Link href="/shorts/0" passHref>
          <Button
            className={cn(
              "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full shadow-lg transition-transform transform",
              isScrollingDown ? "translate-y-24" : "translate-y-0"
            )}
          >
            <Film className="mr-2 h-5 w-5" />
            Shorts
          </Button>
         </Link>
      )}
    </div>
  );
}
