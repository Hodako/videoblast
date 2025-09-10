import VideoCard from './video-card';
import ShortsCarousel from './shorts-carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MainContent({ videos, shorts, categories, onCategoryChange, siteSettings }) {
  
  const showFeatured = siteSettings?.showFeatured ?? false;
  const featuredVideoIds = siteSettings?.featuredVideoIds ?? [];

  const popularVideos = [...videos].sort((a, b) => b.views - a.views);

  const featuredVideos = showFeatured && featuredVideoIds.length > 0 
    ? videos.filter(v => featuredVideoIds.includes(v.id))
    : [];

  const remainingVideos = (showFeatured && featuredVideoIds.length > 0)
    ? videos.filter(v => !featuredVideoIds.includes(v.id))
    : popularVideos;


  const renderVideoGrid = (videoList) => {
    if (videoList.length === 0) {
      return <p className="text-muted-foreground col-span-full text-center py-8">No videos found.</p>;
    }
    return videoList.map((video) => (
      <VideoCard key={video.id} video={video} />
    ));
  }
  
  const createSlug = (name) => name.toLowerCase().replace(/ /g, '-');

  return (
    <div>
      <div className="border-b border-border mb-8 overflow-x-auto whitespace-nowrap">
        <button onClick={() => onCategoryChange(null)} className="inline-block data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground px-4 py-2 text-sm font-medium">All</button>
        {categories.map((cat: any) => (
            <button key={cat.id} onClick={() => onCategoryChange(cat)} className="inline-block data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground px-4 py-2 text-sm font-medium">{cat.name}</button>
        ))}
      </div>
      
      <div className="space-y-10">
        {featuredVideos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {renderVideoGrid(featuredVideos)}
          </div>
        )}

        {shorts.length > 0 && <ShortsCarousel shorts={shorts} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
           {renderVideoGrid(remainingVideos)}
        </div>
      </div>
    </div>
  );
}
