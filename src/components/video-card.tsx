import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type VideoCardProps = {
  video: {
    title: string;
    duration: string;
    views: string;
    uploaded: string;
    thumbnail: string;
    imageUrl: string;
  };
  index: number;
};

export default function VideoCard({ video, index }: VideoCardProps) {
  return (
    <Link href={`/watch/${index}`} className="group">
      <Card className="bg-card border-none rounded-lg overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/20 cursor-pointer">
        <div className="relative w-full aspect-video">
          <Image
            src={video.imageUrl}
            alt={video.title}
            fill
            className="object-cover"
            data-ai-hint={video.thumbnail}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <Badge variant="secondary" className="absolute bottom-2 right-2 bg-black/70 text-white text-xs rounded">
            {video.duration}
          </Badge>
        </div>
      </Card>
      <div className="p-2">
        <h3 className="font-bold text-sm leading-snug truncate group-hover:text-primary transition-colors">{video.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{video.views} &bull; {video.uploaded}</p>
      </div>
    </Link>
  );
}
