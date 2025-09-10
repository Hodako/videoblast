import VideoCard from './video-card';
import ShortsCarousel from './shorts-carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MainContent({ videos, shorts, categories, onCategoryChange, siteSettings }) {

  const featuredVideos = siteSettings?.showFeatured && siteSettings.featuredVideoIds?.length > 0 
    ? videos.filter(v => siteSettings.featuredVideoIds.includes(v.id))
    : [];

  const remainingVideos = siteSettings?.showFeatured
    ? videos.filter(v => !siteSettings.featuredVideoIds?.includes(v.id))
    : videos;

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}>
      <TabsList className="bg-transparent p-0 border-b border-border rounded-none mb-8 justify-start">
        <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground px-4">All</TabsTrigger>
        {categories.map((cat: any) => (
            <TabsTrigger key={cat.id} value={cat.id.toString()} className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground px-4">{cat.name}</TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="all" className="space-y-10">
        {featuredVideos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {featuredVideos.map((video) => (
              <VideoCard key={`featured-${video.id}`} video={video} />
            ))}
          </div>
        )}

        {shorts.length > 0 && <ShortsCarousel shorts={shorts} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {remainingVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </TabsContent>

      {categories.map((cat: any) => (
        <TabsContent key={`content-${cat.id}`} value={cat.id.toString()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {videos.map((video) => (
                    <VideoCard key={`cat-video-${video.id}`} video={video} />
                ))}
            </div>
        </TabsContent>
      ))}

    </Tabs>
  );
}
