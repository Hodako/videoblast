import VideoCard from './video-card';
import ShortsCarousel from './shorts-carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MainContent({ videos, shorts, categories, onCategoryChange, siteSettings }) {
  
  const showFeatured = siteSettings?.showFeatured ?? false;
  const featuredVideoIds = siteSettings?.featuredVideoIds ?? [];

  const featuredVideos = showFeatured && featuredVideoIds.length > 0 
    ? videos.filter(v => featuredVideoIds.includes(v.id))
    : [];

  // If featured videos are turned off, all videos are "remaining"
  const remainingVideos = showFeatured
    ? videos.filter(v => !featuredVideoIds.includes(v.id))
    : videos;

  const renderVideoGrid = (videoList) => {
    if (videoList.length === 0) {
      return <p className="text-muted-foreground col-span-full text-center py-8">No videos found for this filter.</p>;
    }
    return videoList.map((video) => (
      <VideoCard key={video.id} video={video} />
    ));
  }

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}>
      <TabsList className="bg-transparent p-0 border-b border-border rounded-none mb-8 justify-start overflow-x-auto">
        <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground px-4 shrink-0">All</TabsTrigger>
        {categories.map((cat: any) => (
            <TabsTrigger key={cat.id} value={cat.id.toString()} className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground px-4 shrink-0">{cat.name}</TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="all" className="space-y-10">
        {featuredVideos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {renderVideoGrid(featuredVideos)}
          </div>
        )}

        {shorts.length > 0 && <ShortsCarousel shorts={shorts} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
           {renderVideoGrid(remainingVideos)}
        </div>
      </TabsContent>

      {categories.map((cat: any) => (
        <TabsContent key={`content-${cat.id}`} value={cat.id.toString()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {renderVideoGrid(videos)}
            </div>
        </TabsContent>
      ))}

    </Tabs>
  );
}
