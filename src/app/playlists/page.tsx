// src/app/playlists/page.tsx
import Header from '@/components/header';
import { Card } from '@/components/ui/card';
import { ListVideo, Play } from 'lucide-react';
import Image from 'next/image';

const playlists = [
  { name: 'Watch Later', count: 12, thumbnail: 'https://picsum.photos/seed/watch-later/300/180', hint: 'clock' },
  { name: 'Favorites', count: 25, thumbnail: 'https://picsum.photos/seed/favorites/300/180', hint: 'heart' },
  { name: 'Learn Coding', count: 58, thumbnail: 'https://picsum.photos/seed/coding/300/180', hint: 'code computer' },
  { name: 'Workout Music', count: 42, thumbnail: 'https://picsum.photos/seed/workout/300/180', hint: 'gym dumbbell' },
  { name: 'Documentaries', count: 8, thumbnail: 'https://picsum.photos/seed/docs/300/180', hint: 'nature documentary' },
  { name: 'Comedy Specials', count: 15, thumbnail: 'https://picsum.photos/seed/comedy/300/180', hint: 'laughing face' },
];

export default function PlaylistsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5">
        <h1 className="text-3xl font-bold mb-8">My Playlists</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <Card key={playlist.name} className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-video">
                <Image src={playlist.thumbnail} alt={playlist.name} layout="fill" objectFit="cover" data-ai-hint={playlist.hint} />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 bg-black/70 text-white p-2 text-sm flex items-center gap-2 rounded-tl-lg">
                  <ListVideo className="w-4 h-4" />
                  <span>{playlist.count}</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold truncate">{playlist.name}</h3>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
