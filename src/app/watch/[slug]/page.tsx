// src/app/watch/[slug]/page.tsx
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import Header from '@/components/header';
import { getVideoBySlug, getComments as fetchComments, postComment, getVideos, getLikes, likeVideo, unlikeVideo } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Share2, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Captions, RotateCcw, RotateCw, Check, MessageCircle, Send } from 'lucide-react';
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
import ReactPlayer from 'react-player';

// export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
//   const video = await getVideoBySlug(params.slug);
//   if (!video) {
//     return {
//       title: 'Video Not Found',
//       description: 'This video could not be found.',
//     };
//   }

//   const seoTitle = video.meta_data?.seo_title || video.title;
//   const seoDescription = video.meta_data?.seo_description || video.description.substring(0, 160);
//   const imageUrl = video.thumbnail_url || (process.env.NEXT_PUBLIC_BASE_URL + '/logo.svg');
  
//   return {
//     title: seoTitle,
//     description: seoDescription,
//     openGraph: {
//       title: seoTitle,
//       description: seoDescription,
//       url: `${process.env.NEXT_PUBLIC_BASE_URL}/watch/${video.slug}`,
//       images: [
//         {
//           url: imageUrl,
//           width: 1280,
//           height: 720,
//           alt: seoTitle,
//         },
//       ],
//       type: 'video.other',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: seoTitle,
//       description: seoDescription,
//       images: [imageUrl],
//     },
//   };
// }


export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const slug = params.slug as string;
  
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [isBuffering, setIsBuffering] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [visibleComments, setVisibleComments] = useState(3);
  
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
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
        const [commentsData, likesData, allVideos] = await Promise.all([
            fetchComments(currentVideo.id),
            getLikes(currentVideo.id),
            getVideos()
        ]);
        setComments(commentsData);
        setLikeCount(likesData.count);
        setIsLiked(likesData.isLiked);
        
        // Suggestion algorithm
        const suggestions = allVideos
            .filter(v => v.id !== currentVideo.id)
            .sort((a, b) => {
                let scoreA = 0;
                let scoreB = 0;
                
                // Priority 1: Same creator
                if(a.creator_id === currentVideo.creator_id) scoreA += 5;
                if(b.creator_id === currentVideo.creator_id) scoreB += 5;

                // Priority 2: Shared categories
                const currentVideoCategoryIds = currentVideo.categories.map(c => c.category_id);
                a.categories?.forEach(cat => { if(currentVideoCategoryIds.includes(cat.category_id)) scoreA += 2 });
                b.categories?.forEach(cat => { if(currentVideoCategoryIds.includes(cat.category_id)) scoreB += 2 });

                // Priority 3: Shared tags
                a.tags?.forEach(tag => { if(currentVideo.tags.includes(tag)) scoreA += 1 });
                b.tags?.forEach(tag => { if(currentVideo.tags.includes(tag)) scoreB += 1 });

                return scoreB - scoreA;
            })
            .slice(0, 10);
            
        setRecommendedVideos(suggestions);

      } else {
        router.push('/not-found');
      }
    } catch (error) {
      console.error("Failed to fetch video data:", error);
      router.push('/not-found');
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

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    if(isPlaying) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const handleMouseLeave = () => {
    if(isPlaying) {
        setShowControls(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleVolumeChange = (value: number[]) => {
      const newVolume = value[0];
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
  };
  
  const handleToggleMute = useCallback(() => {
      setIsMuted(!isMuted);
  }, [isMuted]);

  const handleSeekChange = (value: number[]) => {
    setIsSeeking(true);
    setProgress(value[0]);
  };
  
  const handleSeekCommit = (value: number[]) => {
    const newTime = value[0];
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, 'seconds');
      setProgress(newTime);
    }
    setIsSeeking(false);
  };
  
  const handleProgress = (state: { played: number, playedSeconds: number, loaded: number, loadedSeconds: number }) => {
    if (!isSeeking) {
      setProgress(state.playedSeconds);
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
    setPlaybackRate(rate);
  };

  const skipTime = (amount: number) => {
    if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        playerRef.current.seekTo(currentTime + amount, 'seconds');
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

  const handleLike = async () => {
    if(!user || !video) {
        toast({variant: "destructive", title: "Please login to like videos."})
        return;
    };
    try {
      if(isLiked) {
        await unlikeVideo(video.id);
        setLikeCount(prev => prev -1);
        setIsLiked(false);
      } else {
        await likeVideo(video.id);
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: `Failed to update like: ${error.message}` });
    }
  }

  useEffect(() => {
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
    
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullScreenChange);
    };
  }, [handlePlayPause, handleToggleFullScreen, handleToggleMute]);

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
  
  return (
    <>
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
              <ReactPlayer
                ref={playerRef}
                url={`/api/stream/${video.id}`}
                playing={isPlaying}
                volume={volume}
                muted={isMuted}
                playbackRate={playbackRate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onBuffer={() => setIsBuffering(true)}
                onBufferEnd={() => setIsBuffering(false)}
                onProgress={handleProgress}
                onDuration={setDuration}
                width="100%"
                height="100%"
                className="react-player"
                config={{ file: { forceVideo: true } }}
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
                    onValueChange={handleSeekChange}
                    onValueCommit={handleSeekCommit}
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
                        {formatTime(progress)} / {formatTime(duration)}
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
                  <Button variant="ghost" onClick={handleLike}>
                    <ThumbsUp className={cn("mr-2 h-4 w-4", isLiked && "fill-current text-primary")} /> {likeCount}
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
                    {comments.slice(0, visibleComments).map((comment: any) => (
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
                    {comments.length > visibleComments && (
                      <Button variant="link" onClick={() => setVisibleComments(prev => prev + 3)}>Show more comments</Button>
                    )}
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
