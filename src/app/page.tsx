
'use client';
import { useState, useEffect, useCallback } from 'react';
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
import { getVideos, getShorts, getSiteSettings, getCategories } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { y } = useWindowScroll();
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastY, setLastY] = useState(0);
  const isMobile = useIsMobile();
  const [allVideos, setAllVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ types: [], category: null, tag: null, sortBy: 'relevance' });
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    if (y > lastY) {
      setIsScrollingDown(true);
    } else {
      setIsScrollingDown(false);
    }
    setLastY(y);
  }, [y, lastY]);

  const fetchFilteredVideos = useCallback(async (newFilters) => {
      setIsLoading(true);
      try {
        const videosData = await getVideos(newFilters);
        setAllVideos(videosData);
      } catch (error) {
        console.error("Failed to fetch filtered videos:", error);
      } finally {
        setIsLoading(false);
      }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [videosData, shortsData, categoriesData, settingsData] = await Promise.all([
          getVideos(filters),
          getShorts(),
          getCategories(),
          getSiteSettings()
        ]);
        
        const tags = videosData.reduce((acc, video) => {
            if(video.tags) {
                video.tags.forEach(tag => {
                    if (!acc.includes(tag)) {
                        acc.push(tag);
                    }
                });
            }
            return acc;
        }, []);

        setAllTags(tags);
        setAllVideos(videosData);
        setShorts(shortsData);
        setCategories(categoriesData);
        setSiteSettings(settingsData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchFilteredVideos(updatedFilters);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <PromoBanner settings={siteSettings}/>
      <div className="flex flex-col md:flex-row">
        <aside className="w-full shrink-0 md:w-[250px] md:sticky md:top-[60px] md:h-[calc(100vh-60px)] overflow-y-auto bg-card p-5 border-r-0 md:border-r border-border md:order-1 order-2">
          <SidebarContent onFilterChange={handleFilterChange} categories={categories} tags={allTags} />
        </aside>
        <main className="flex-1 p-5 md:order-2 order-1">
          {isLoading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
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
               <Skeleton className="h-48 w-full" />
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
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
            </div>
          ) : (
            <MainContent 
              videos={allVideos} 
              shorts={shorts} 
              categories={categories}
              onCategoryChange={(catId) => handleFilterChange({category: catId, tag: null})}
              siteSettings={siteSettings}
            />
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
