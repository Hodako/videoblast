// src/app/shorts/[id]/page.tsx
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getShorts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, ChevronUp, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';

export default function ShortsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id ? parseInt(params.id as string, 10) : 0;
  
  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(id);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchShorts = async () => {
      const shortsData = await getShorts();
      setShorts(shortsData);
    };
    fetchShorts();
  }, []);

  const currentShort = shorts[currentIndex];

  const goToNextShort = () => {
    const nextIndex = (currentIndex + 1) % shorts.length;
    router.push(`/shorts/${nextIndex}`, { scroll: false });
  };

  const goToPrevShort = () => {
    const prevIndex = (currentIndex - 1 + shorts.length) % shorts.length;
    router.push(`/shorts/${prevIndex}`, { scroll: false });
  };

  useEffect(() => {
    setCurrentIndex(id);
  }, [id]);

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
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
  }, [id]);
  
  if (!currentShort) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Short not found.
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
          src={currentShort.videoUrl}
          loop
          className="w-full h-full object-cover"
          onClick={(e) => e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause()}
          autoPlay
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
          <div className="flex items-center gap-2 mb-2">
            <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/150?u=${currentShort.title}`} />
              <AvatarFallback>{currentShort.title.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-semibold text-sm">@{currentShort.title.split(' ').join('').toLowerCase()}</p>
            <Button variant="outline" size="sm" className="ml-2 bg-white text-black border-none h-7">Follow</Button>
          </div>
          <p className="text-sm">{currentShort.title}</p>
          <p className="text-xs text-neutral-300">{currentShort.views}</p>
        </div>

        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4 text-white">
          <Button variant="ghost" size="icon" className="flex flex-col h-auto">
            <Heart className="w-8 h-8"/>
            <span className="text-xs">15k</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col h-auto">
            <MessageCircle className="w-8 h-8"/>
            <span className="text-xs">1.2k</span>
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
