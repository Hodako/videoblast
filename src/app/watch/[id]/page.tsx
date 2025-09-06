// src/app/watch/[id]/page.tsx
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import Header from '@/components/header';
import { videos } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Share2, Download, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Captions } from 'lucide-react';
import VideoCard from '@/components/video-card';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function WatchPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string, 10) : -1;
  
  const video = videos[id];
  const recommendedVideos = videos.filter((_, index) => index !== id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  let controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  const handleToggleMute = useCallback(() => {
    if (videoRef.current) {
        const currentVolume = videoRef.current.volume;
        if (isMuted || currentVolume === 0) {
            const newVolume = volume > 0 ? volume : 1;
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(false);
        } else {
            videoRef.current.volume = 0;
            setIsMuted(true);
        }
    }
  }, [isMuted, volume]);

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const handleToggleFullScreen = useCallback(() => {
    if (!playerContainerRef.current) return;

    if (!isFullScreen) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress(video.currentTime);
      setCurrentTime(video.currentTime);
    };
    const setVideoDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', setVideoDuration);
    video.play();

    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', setVideoDuration);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [id]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleMouseLeave = () => {
    if(isPlaying) {
        setShowControls(false);
    }
  };

  if (id === -1 || !video) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <Header />
            <p>Video not found.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-col lg:flex-row p-5 gap-5">
        <div className="flex-1">
          <div 
            ref={playerContainerRef}
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group/player"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full"
              onClick={handlePlayPause}
            />
            <div 
              className={cn(
                "absolute inset-0 bg-black/30 transition-opacity duration-300",
                showControls ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Button variant="ghost" size="icon" className="w-20 h-20" onClick={handlePlayPause}>
                  {isPlaying ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12" />}
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <Slider
                  min={0}
                  max={duration}
                  step={1}
                  value={[progress]}
                  onValueChange={handleProgressChange}
                  className="w-full"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={handlePlayPause}>
                      {isPlaying ? <Pause /> : <Play />}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={handleToggleMute}>
                        {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
                      </Button>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        className="w-24"
                      />
                    </div>
                    <div className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Captions /></Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon"><Settings /></Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-2">
                            <p className="text-sm p-2 hover:bg-muted rounded-md cursor-pointer">Playback Speed</p>
                            <p className="text-sm p-2 hover:bg-muted rounded-md cursor-pointer">Quality</p>
                        </PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="icon" onClick={handleToggleFullScreen}>
                      {isFullScreen ? <Minimize /> : <Maximize />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4">
            <h1 className="text-2xl font-bold">{video.title}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${video.subtitle}`} />
                  <AvatarFallback>{video.subtitle.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{video.subtitle}</p>
                  <p className="text-sm text-muted-foreground">1.2M subscribers</p>
                </div>
                <Button variant="outline">Subscribe</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost">
                  <ThumbsUp className="mr-2 h-4 w-4" /> 15K
                </Button>
                <Button variant="ghost">
                  <ThumbsDown className="mr-2 h-4 w-4" /> 1K
                </Button>
                <Button variant="ghost">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                
              </div>
            </div>
            <div className="mt-4 bg-muted p-4 rounded-lg">
              <p className="font-semibold">{video.views} &bull; {video.uploaded}</p>
              <p className="text-sm mt-2">{video.description}</p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[350px] shrink-0">
          <h2 className="text-xl font-bold mb-4">Up next</h2>
          <div className="space-y-4">
            {recommendedVideos.map((recVideo, index) => (
              <VideoCard key={index} video={recVideo} index={videos.indexOf(recVideo)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
