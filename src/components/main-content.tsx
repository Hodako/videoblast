import { videos } from '@/lib/data';
import VideoCard from './video-card';
import ShortsCarousel from './shorts-carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MainContent() {
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
        <ShortsCarousel />
      </TabsContent>
      <TabsContent value="trending">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Trending videos coming soon.</p>
        </div>
      </TabsContent>
      <TabsContent value="new">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">New videos coming soon.</p>
        </div>
      </TabsContent>
      <TabsContent value="photos">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Photos coming soon.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
