// src/app/playlists/[id]/page.tsx
'use client'
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import VideoCard from '@/components/video-card';
import { getAdminPlaylists } from '@/lib/data';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ListVideo, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import Link from 'next/link';

export default function PlaylistPage() {
  const params = useParams();
  const id = params.id as string;

  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if(!id) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allPlaylists = await getAdminPlaylists();
        const currentPlaylist = allPlaylists.find(p => p.id.toString() === id);
        setPlaylist(currentPlaylist);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const playlistVideos = playlist?.videos?.map(v => v.video).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col md:flex-row gap-8">
             <div className="w-full md:w-1/3">
                 <Skeleton className="aspect-video w-full rounded-xl"/>
                 <Skeleton className="h-8 w-3/4 mt-4"/>
                 <Skeleton className="h-5 w-1/2 mt-2"/>
                 <Skeleton className="h-5 w-1/4 mt-2"/>
             </div>
             <div className="w-full md:w-2/3 space-y-4">
                 {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 w-full"/>)}
             </div>
          </div>
        ) : playlist ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 md:sticky top-20 self-start">
                <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
                    {playlistVideos.length > 0 && playlistVideos[0].thumbnail_url ? (
                        <Image src={playlistVideos[0].thumbnail_url} alt={playlist.name} fill className="object-cover" />
                    ) : (
                         <div className="flex items-center justify-center h-full">
                            <ListVideo className="w-16 h-16 text-muted-foreground"/>
                        </div>
                    )}
                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <ListVideo className="w-12 h-12 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold mt-4">{playlist.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Avatar className="w-6 h-6">
                        <AvatarFallback>{playlist.user.first_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{playlist.user.first_name}</span>
                    <span>&bull;</span>
                    <span>{playlistVideos.length} videos</span>
                </div>
            </div>
            <div className="w-full md:w-2/3">
                {playlistVideos.length > 0 ? (
                    <div className="space-y-4">
                        {playlistVideos.map((video, index) => (
                           <Link key={video.id} href={`/watch/${video.slug}`} className="flex items-center gap-4 group p-2 rounded-lg hover:bg-muted">
                                <span className="text-muted-foreground font-mono">{index + 1}</span>
                                <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0">
                                    <Image src={video.thumbnail_url} alt={video.title} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold group-hover:text-primary line-clamp-2">{video.title}</h3>
                                    <p className="text-xs text-muted-foreground">{video.creator?.name}</p>
                                </div>
                           </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-8">This playlist is empty.</p>
                )}
            </div>
          </div>
        ) : (
             <div className="text-center py-16">
                <h1 className="text-3xl font-bold mb-4">Playlist Not Found</h1>
                <p className="text-muted-foreground">Sorry, we couldn't find the playlist you're looking for.</p>
            </div>
        )}
      </main>
    </div>
  );
}
