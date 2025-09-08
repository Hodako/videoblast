import VideoCard from './video-card';
import ShortsCarousel from './shorts-carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MainContent({ videos, shorts }) {
  const trendingVideos = [...videos].sort((a, b) => parseInt(b.views) - parseInt(a.views));
  const newVideos = [...videos].sort((a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime());
  const photos = videos.filter(v => v.thumbnail && v.thumbnail.includes('bigger'));

  const topFourVideos = videos.slice(0, 4);
  const remainingVideos = videos.slice(4);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="bg-transparent p-0 border-b border-border rounded-none mb-8 justify-start">
        <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground px-4">All Videos</TabsTrigger>
        <TabsTrigger value="trending" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground px-4">Trending</TabsTrigger>
        <TabsTrigger value="new" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground px-4">New</TabsTrigger>
        <TabsTrigger value="photos" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground px-4">Photos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mb-10">
          {topFourVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        <ShortsCarousel shorts={shorts} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-10">
          {remainingVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="trending">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {trendingVideos.map((video) => (
              <VideoCard key={`trending-${video.id}`} video={video} />
            ))}
          </div>
      </TabsContent>
      <TabsContent value="new">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {newVideos.map((video) => (
              <VideoCard key={`new-${video.id}`} video={video} />
            ))}
          </div>
      </TabsContent>
      <TabsContent value="photos">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {photos.map((video) => (
              <VideoCard key={`photo-${video.id}`} video={video} />
            ))}
          </div>
      </TabsContent>
    </Tabs>
  );
}
