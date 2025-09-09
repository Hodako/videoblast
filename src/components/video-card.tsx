import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from './ui/skeleton';

type VideoCardProps = {
  video: {
    id: number;
    title: string;
    duration: string;
    views: number;
    uploaded: string;
    thumbnail_url: string;
    slug: string;
  };
};

export default function VideoCard({ video }: VideoCardProps) {
  if (!video) {
    return (
       <div className="group">
          <Skeleton className="w-full aspect-video rounded-lg" />
          <div className="p-2">
            <Skeleton className="h-5 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </div>
      </div>
    )
  }

  const formatViews = (views: number) => {
    if (isNaN(views)) return '0 views';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const uploadedDate = video.uploaded ? new Date(video.uploaded) : new Date();
  const timeAgo = formatDistanceToNow(uploadedDate, { addSuffix: true });

  return (
    <Link href={`/watch/${video.slug}`} className="group">
      <Card className="bg-card border-none rounded-lg overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/20 cursor-pointer">
        <div className="relative w-full aspect-video">
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <Badge variant="secondary" className="absolute bottom-2 right-2 bg-black/70 text-white text-xs rounded">
            {video.duration}
          </Badge>
        </div>
      </Card>
      <div className="p-2">
        <h3 className="font-bold text-sm leading-snug truncate group-hover:text-primary transition-colors">{video.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{formatViews(video.views)} &bull; {timeAgo}</p>
      </div>
    </Link>
  );
}
