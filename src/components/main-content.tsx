import VideoCard from './video-card';
import ShortsCarousel from './shorts-carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MainContent({ videos, shorts }) {
  const trendingVideos = videos.slice().sort(() => 0.5 - Math.random()).slice(0, 8);
  const newVideos = [...videos].reverse().slice(0, 8);
  const photos = videos.filter(v => v.thumbnail && v.thumbnail.includes('bigger'));

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
          {videos.map((video, index) => (
            <VideoCard key={index} video={video} index={index} />
          ))}
        </div>
        <ShortsCarousel shorts={shorts} />
      </TabsContent>
      <TabsContent value="trending">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {trendingVideos.map((video, index) => (
              <VideoCard key={`trending-${index}`} video={video} index={videos.indexOf(video)} />
            ))}
          </div>
      </TabsContent>
      <TabsContent value="new">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {newVideos.map((video, index) => (
              <VideoCard key={`new-${index}`} video={video} index={videos.indexOf(video)} />
            ))}
          </div>
      </TabsContent>
      <TabsContent value="photos">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {photos.map((video, index) => (
              <VideoCard key={`photo-${index}`} video={video} index={videos.indexOf(video)} />
            ))}
          </div>
      </TabsContent>
    </Tabs>
  );
}
