// src/app/shorts/[id]/page.tsx
'use client';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getShorts, getShortBySlug } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, ChevronUp, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShortsPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const slug = params.id as string;
  
  const [shorts, setShorts] = useState([]);
  const [currentShort, setCurrentShort] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchAllShorts = async () => {
      const shortsData = await getShorts();
      setShorts(shortsData);
    };
    fetchAllShorts();
  }, []);

  useEffect(() => {
      if (shorts.length > 0) {
          const initialIndex = shorts.findIndex(s => s.slug === slug);
          if (initialIndex !== -1) {
              setCurrentShort(shorts[initialIndex]);
              setCurrentIndex(initialIndex);
              setIsLoading(false);
          } else {
              // Handle case where slug is not found, maybe redirect to first short
              if (shorts[0]?.slug) {
                router.replace(`/shorts/${shorts[0].slug}`);
              }
          }
      }
  }, [slug, shorts, router]);

  const goToNextShort = () => {
    if (shorts.length === 0 || currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % shorts.length;
    router.push(`/shorts/${shorts[nextIndex].slug}`, { scroll: false });
  };

  const goToPrevShort = () => {
    if (shorts.length === 0 || currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + shorts.length) % shorts.length;
    router.push(`/shorts/${shorts[prevIndex].slug}`, { scroll: false });
  };

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.error("Autoplay was prevented.", e));
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            goToNextShort();
        } else if (e.key === 'ArrowUp') {
            goToPrevShort();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, shorts.length]);
  
  if (isLoading || !currentShort) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <Skeleton className="w-full h-full max-w-[400px] aspect-[9/16] bg-neutral-800" />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
        <Link href="/" className="absolute top-4 left-4 z-20">
            <Button variant="ghost" size="icon" className="text-white bg-black/50 hover:bg-black/70">
                <X />
            </Button>
        </Link>
      <div className="relative w-full h-full max-w-[400px] aspect-[9/16]">
        <video
          ref={videoRef}
          src={currentShort.video_url}
          loop
          className="w-full h-full object-cover"
          onClick={(e) => e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause()}
          playsInline
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
          <div className="flex items-center gap-2 mb-2">
            <Avatar>
              <AvatarImage src={currentShort.creator?.image_url} />
              <AvatarFallback>{currentShort.creator?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-semibold text-sm">@{currentShort.creator?.name.split(' ').join('').toLowerCase()}</p>
          </div>
          <p className="text-sm">{currentShort.title}</p>
          <p className="text-xs text-neutral-300">{currentShort.views} views</p>
        </div>

        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4 text-white">
          <Button variant="ghost" size="icon" className="flex flex-col h-auto">
            <Heart className="w-8 h-8"/>
            <span className="text-xs">Like</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col h-auto">
            <MessageCircle className="w-8 h-8"/>
            <span className="text-xs">Comment</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col h-auto">
            <Share2 className="w-8 h-8"/>
            <span className="text-xs">Share</span>
          </Button>
        </div>
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <Button variant="ghost" size="icon" onClick={goToPrevShort} className="text-white bg-black/50 hover:bg-black/70">
          <ChevronUp />
        </Button>
        <Button variant="ghost" size="icon" onClick={goToNextShort} className="text-white bg-black/50 hover:bg-black/70">
          <ChevronDown />
        </Button>
      </div>

    </div>
  );
}
