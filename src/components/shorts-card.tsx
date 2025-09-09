import Image from 'next/image';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

type ShortsCardProps = {
  short: {
    id: number;
    title: string;
    views: string;
    thumbnail_url: string;
  };
  index: number;
};

export default function ShortsCard({ short, index }: ShortsCardProps) {
  return (
    <Link href={`/shorts/${index}`}>
    <Card className="w-full overflow-hidden rounded-lg bg-card border-none aspect-[9/16] relative cursor-pointer transition-transform hover:scale-105 group">
      <Image
        src={short.thumbnail_url}
        alt={short.title}
        fill
        className="object-cover transition-transform group-hover:scale-110"
        sizes="(max-width: 768px) 33vw, 12.5vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <h3 className="text-xs font-bold text-white truncate">{short.title}</h3>
        <p className="text-[10px] text-neutral-300">{short.views} views</p>
      </div>
    </Card>
    </Link>
  );
}
