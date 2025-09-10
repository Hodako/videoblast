// src/app/watch/[slug]/page.tsx
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import Head from 'next/head';
import Header from '@/components/header';
import { getVideoBySlug, getComments as fetchComments, postComment, likeVideo, unlikeVideo, getLikes } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Share2, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Captions, RotateCcw, RotateCw, Check, MessageCircle, Send, Heart } from 'lucide-react';
import VideoCard from '@/components/video-card';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const slug = params.slug as string;
  
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [isBuffering, setIsBuffering] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];
  let controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const currentVideo = await getVideoBySlug(slug);
      if (currentVideo) {
        setVideo(currentVideo);
        // Fetch comments and likes for this video
        const commentsData = await fetchComments(currentVideo.id);
        setComments(commentsData);
        const likesData = await getLikes(currentVideo.id);
        setLikes(likesData.count);

      } else {
        router.push('/404');
      }
    } catch (error) {
      console.error("Failed to fetch video data:", error);
      router.push('/404');
    } finally {
      setIsLoading(false);
    }
  }, [slug, router]);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadData();
  }, [slug, loadData]);


  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };
  
  const handleToggleMute = useCallback(() => {
    if (videoRef.current) {
        const newMuted = !videoRef.current.muted;
        videoRef.current.muted = newMuted;
        setIsMuted(newMuted);
        if(!newMuted && videoRef.current.volume === 0) {
           videoRef.current.volume = 1;
           setVolume(1);
        }
    }
  }, []);

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const handleToggleFullScreen = useCallback(() => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const skipTime = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };
  
  const handleShare = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Success", description: "Link copied to clipboard!" });
    } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Failed to copy link." });
    }
  };
  
  const handleCommentSubmit = async () => {
      if (!newComment.trim() || !user || !video) return;
      setIsSubmittingComment(true);
      try {
          const addedComment = await postComment(video.id, newComment);
          setComments([addedComment, ...comments]);
          setNewComment('');
      } catch (error) {
           toast({ variant: "destructive", title: "Error", description: "Failed to post comment." });
      } finally {
          setIsSubmittingComment(false);
      }
  }

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setProgress(videoElement.currentTime);
      setCurrentTime(videoElement.currentTime);
    };
    const onDurationChange = () => {
        if (videoElement.duration && isFinite(videoElement.duration)) {
             setDuration(videoElement.duration);
        }
    };
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onCanPlay = () => {
      setIsBuffering(false);
      onDurationChange(); // Fire immediately on canplay
    }
    
    videoElement.addEventListener('play', onPlay);
    videoElement.addEventListener('pause', onPause);
    videoElement.addEventListener('timeupdate', onTimeUpdate);
    videoElement.addEventListener('durationchange', onDurationChange);
    videoElement.addEventListener('loadedmetadata', onDurationChange);
    videoElement.addEventListener('waiting', onWaiting);
    videoElement.addEventListener('playing', onPlaying);
    videoElement.addEventListener('canplay', onCanPlay);

    const onKeyDown = (e: KeyboardEvent) => {
        if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        switch(e.key.toLowerCase()) {
            case ' ': case 'k': handlePlayPause(); break;
            case 'f': handleToggleFullScreen(); break;
            case 'arrowleft': skipTime(-10); break;
            case 'arrowright': skipTime(10); break;
            case 'm': handleToggleMute(); break;
        }
    };
    window.addEventListener('keydown', onKeyDown);
    
    const onFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullScreenChange);
    
    // Attempt to play on mount
    videoElement.play().catch(() => {
        setIsPlaying(false)
    });

    return () => {
      videoElement.removeEventListener('play', onPlay);
      videoElement.removeEventListener('pause', onPause);
      videoElement.removeEventListener('timeupdate', onTimeUpdate);
      videoElement.removeEventListener('durationchange', onDurationChange);
      videoElement.removeEventListener('loadedmetadata', onDurationChange);
      videoElement.removeEventListener('waiting', onWaiting);
      videoElement.removeEventListener('playing', onPlaying);
      videoElement.removeEventListener('canplay', onCanPlay);
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullScreenChange);
    };
  }, [video, handlePlayPause, handleToggleFullScreen, handleToggleMute]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex flex-col lg:flex-row p-5 gap-5">
          <div className="flex-1">
            <Skeleton className="w-full aspect-video rounded-lg" />
            <div className="py-4">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Skeleton className="h-9 w-20" />
                   <Skeleton className="h-9 w-20" />
                   <Skeleton className="h-9 w-20" />
                </div>
              </div>
              <Skeleton className="mt-4 h-24 w-full" />
            </div>
          </div>
          <div className="w-full lg:w-[350px] shrink-0">
             <Skeleton className="h-6 w-1/3 mb-4" />
             <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                      <Skeleton className="h-[94px] w-[168px] rounded-lg shrink-0"/>
                      <div className="w-full">
                          <Skeleton className="h-5 w-full mb-2"/>
                          <Skeleton className="h-4 w-3/4"/>
                      </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return null; // or a custom 404 component, handled by redirect
  }

  const seoTitle = video.meta_data?.seo_title || video.title;
  const seoDescription = video.meta_data?.seo_description || video.description;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Head>
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
                src={video.video_url}
                className="w-full h-full"
                onClick={handlePlayPause}
                playsInline
                crossOrigin="anonymous"
              />
              {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                   <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <div 
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 z-10",
                  showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-10">
                  <Button variant="ghost" size="icon" className="w-16 h-16 text-white hover:bg-white/10 hover:text-white" onClick={() => skipTime(-10)}>
                    <RotateCcw className="w-10 h-10" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-20 h-20 text-white hover:bg-white/10 hover:text-white" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="w-16 h-16 text-white hover:bg-white/10 hover:text-white" onClick={() => skipTime(10)}>
                    <RotateCw className="w-10 h-10" />
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
                      {!isMobile && (
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
                      )}
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
                          <PopoverContent className="w-56 p-2 bg-background/90 backdrop-blur-sm border-slate-700">
                             <div className="text-sm p-2 rounded-md">
                                  <p className="font-semibold mb-2">Playback Speed</p>
                                  <div className="space-y-1">
                                      {playbackRates.map(rate => (
                                          <button 
                                              key={rate} 
                                              onClick={() => handlePlaybackRateChange(rate)}
                                              className={cn(
                                                  "w-full text-left p-2 rounded-md hover:bg-muted/50 flex items-center justify-between",
                                                  rate === playbackRate && "bg-muted/50"
                                              )}
                                          >
                                              <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                                              {rate === playbackRate && <Check className="w-4 h-4" />}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                              <p className="text-sm p-2 hover:bg-muted/50 rounded-md cursor-pointer mt-2">Quality</p>
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
              <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <Avatar>
                      <AvatarImage src={video.creator?.image_url} alt={video.creator?.name} />
                      <AvatarFallback>{video.creator?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{video.creator?.name}</p>
                    <p className="text-sm text-muted-foreground">{new Date(video.uploaded).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost">
                    <ThumbsUp className="mr-2 h-4 w-4" /> {likes}
                  </Button>
                  <Button variant="ghost" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
              <div className="mt-4 bg-muted p-4 rounded-lg">
                <p className="font-semibold">{video.views.toLocaleString()} views</p>
                <p className="text-sm mt-2 whitespace-pre-wrap">{video.description}</p>
              </div>
               <div className="mt-6">
                  <div className="flex items-center gap-4 mb-4">
                      <MessageCircle className="w-6 h-6" />
                      <h2 className="text-xl font-bold">{comments.length} Comments</h2>
                  </div>
                  <div className="space-y-4">
                    {!user ? (
                      <div className="bg-muted p-4 rounded-lg text-center">
                        <p className="text-muted-foreground">
                            <Link href="/login" className="text-primary underline">Login</Link> or <Link href="/signup" className="text-primary underline">Sign up</Link> to post a comment.
                        </p>
                      </div>
                    ): (
                      <div className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="relative w-full">
                              <Textarea 
                                placeholder="Add a comment..." 
                                className="bg-background pr-12" 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                disabled={isSubmittingComment}
                              />
                              <Button size="icon" className="absolute right-2 bottom-2" disabled={isSubmittingComment || !newComment.trim()} onClick={handleCommentSubmit}>
                                  <Send className="w-4 h-4" />
                              </Button>
                          </div>
                      </div>
                    )}
                    {comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar>
                           <AvatarFallback>{comment.user.first_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">@{comment.user.first_name}{comment.user.last_name}</p>
                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</p>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[350px] shrink-0">
            <h2 className="text-xl font-bold mb-4">Up next</h2>
            <div className="space-y-4">
              {recommendedVideos.map((recVideo) => (
                <VideoCard key={recVideo.id} video={recVideo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
