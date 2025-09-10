// src/app/admin/videos/reorder/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { getAdminVideos, reorderVideos } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List, GripVertical } from 'lucide-react';
import Image from 'next/image';

export default function ReorderVideosPage() {
  const { toast } = useToast();
  const [videos, setVideos] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosData = await getAdminVideos();
        // Ensure videos are sorted by display_order initially
        setVideos(videosData.sort((a, b) => a.display_order - b.display_order));
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load videos.' });
      }
    };
    fetchVideos();
  }, [toast]);

  const handleDragStart = (e, index) => {
    setDraggedItem(videos[index]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = videos[index];
    if (draggedItem === draggedOverItem) {
      return;
    }
    let items = videos.filter(item => item !== draggedItem);
    items.splice(index, 0, draggedItem);
    setVideos(items);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const orderedVideoIds = videos.map((video, index) => ({ id: video.id, order: index }));
      await reorderVideos(orderedVideoIds);
      toast({ title: 'Success', description: 'Video order saved successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save video order.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reorder Videos</h1>
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Order'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sort Videos for Relevance</CardTitle>
          <CardDescription>
            Drag and drop the videos below to set their display order. This order will be used for the "Relevance" sort option on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {videos.map((video, index) => (
              <div
                key={video.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="flex items-center gap-4 p-2 rounded-md border bg-card hover:bg-muted cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <span className="w-8 text-sm text-muted-foreground font-mono">{index + 1}</span>
                {video.thumbnail_url && (
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    width={80}
                    height={45}
                    className="rounded-sm object-cover"
                  />
                )}
                <span className="font-medium">{video.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
