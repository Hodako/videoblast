// src/app/categories/[slug]/page.tsx
'use client'
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import VideoCard from '@/components/video-card';
import { getVideos, getCategories } from '@/lib/data';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentCategory = useMemo(() => {
    if (!slug || categories.length === 0) return null;
    // Find category by comparing slugs
    return categories.find(cat => cat.name.toLowerCase().replace(/ /g, '-') === slug);
  }, [slug, categories]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [allCategories, allVideos] = await Promise.all([
          getCategories(),
          getVideos()
        ]);
        setCategories(allCategories);
        setVideos(allVideos);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredVideos = useMemo(() => {
    if (!currentCategory) return [];
    return videos.filter(video => 
        video.categories?.some(catInfo => catInfo.category_id === currentCategory.id)
    );
  }, [videos, currentCategory]);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5 max-w-7xl mx-auto">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-1/3 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {[...Array(10)].map((_, i) => (
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
          </>
        ) : currentCategory ? (
          <>
            <div className="flex items-center gap-4 mb-8">
                <Tag className="w-8 h-8 text-primary"/>
                <h1 className="text-3xl font-bold">
                    {currentCategory.name}
                </h1>
            </div>
            {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {filteredVideos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            ): (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No videos found in this category.</p>
                </div>
            )}
          </>
        ) : (
             <div className="text-center py-16">
                <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
                <p className="text-muted-foreground">Sorry, we couldn't find the category you're looking for.</p>
            </div>
        )}
      </main>
    </div>
  );
}
