// src/app/videos/page.tsx
import { Suspense } from 'react';
import VideosComponent from '@/components/videos-component';
import Header from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

const VideosPageSkeleton = () => {
    return (
     <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">All Videos</h1>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {[...Array(20)].map((_, i) => (
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
      </main>
    </div>
    )
}


export default function VideosPage() {
  return (
    <Suspense fallback={<VideosPageSkeleton />}>
      <VideosComponent />
    </Suspense>
  );
}
