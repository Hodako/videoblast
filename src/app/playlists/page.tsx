// src/app/playlists/page.tsx
'use client'
import Header from '@/components/header';
import { Card } from '@/components/ui/card';
import { ListVideo, Play } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getAdminPlaylists } from '@/lib/data'; // Use admin to get all playlists for now
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
        setIsLoading(true);
        try {
            const data = await getAdminPlaylists();
            setPlaylists(data);
        } catch (error) {
            console.error("Failed to fetch playlists:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchPlaylists();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Playlists</h1>
        {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <Skeleton className="aspect-video w-full" />
                        <div className="p-3">
                            <Skeleton className="h-5 w-3/4"/>
                        </div>
                    </Card>
                ))}
             </div>
        ) : playlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists.map((playlist: any) => (
                <Link key={playlist.id} href={`/playlists/${playlist.id}`} className="block">
                  <Card className="overflow-hidden group cursor-pointer">
                    <div className="relative aspect-video bg-muted">
                        {playlist.videos && playlist.videos.length > 0 && playlist.videos[0].video.thumbnail_url ? (
                            <Image src={playlist.videos[0].video.thumbnail_url} alt={playlist.name} fill objectFit="cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <ListVideo className="w-12 h-12 text-muted-foreground"/>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-black/70 text-white p-2 text-sm flex items-center gap-2 rounded-tl-lg">
                        <ListVideo className="w-4 h-4" />
                        <span>{playlist.videos?.length || 0}</span>
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="font-bold truncate">{playlist.name}</h3>
                        <p className="text-xs text-muted-foreground">by {playlist.user.first_name}</p>
                    </div>
                  </Card>
                </Link>
            ))}
            </div>
        ) : (
             <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No playlists found.</p>
            </div>
        )}
      </main>
    </div>
  );
}
