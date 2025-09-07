// src/app/admin/videos/page.tsx
'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminVideos, addVideo, updateVideo, deleteVideo } from "@/lib/data";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminVideosPage() {
  const { toast } = useToast();
  const [videos, setVideos] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({
    id: null,
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    tags: '',
    meta_data: '',
    subtitle: 'Admin Upload',
    duration: '0:00',
    views: '0',
    uploaded: new Date().toLocaleDateString(),
  });

  const fetchVideos = async () => {
    try {
      const data = await getAdminVideos();
      setVideos(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load videos." });
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenDialog = (video = null) => {
    if (video) {
      setIsEditing(true);
      setCurrentVideo({
        ...video,
        tags: Array.isArray(video.tags) ? video.tags.join(', ') : '',
        meta_data: video.meta_data ? JSON.stringify(video.meta_data) : ''
      });
    } else {
      setIsEditing(false);
      setCurrentVideo({
        id: null,
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        tags: '',
        meta_data: '',
        subtitle: 'Admin Upload',
        duration: '0:00',
        views: '0',
        uploaded: new Date().toLocaleDateString(),
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleSaveVideo = async () => {
    const videoPayload = {
      ...currentVideo,
      tags: currentVideo.tags.split(',').map(tag => tag.trim()),
      meta_data: currentVideo.meta_data ? JSON.parse(currentVideo.meta_data) : {}
    };

    try {
      if (isEditing) {
        await updateVideo(videoPayload);
        toast({ title: "Success", description: "Video updated." });
      } else {
        await addVideo(videoPayload);
        toast({ title: "Success", description: "Video added." });
      }
      fetchVideos();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save video." });
    }
  };

  const handleDeleteVideo = async (id: number) => {
    try {
      await deleteVideo(id);
      fetchVideos();
      toast({ title: "Success", description: "Video deleted." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete video." });
    }
  };
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCurrentVideo(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Videos</h1>
        <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add Video</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Video' : 'Add New Video'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" value={currentVideo.title} onChange={handleInputChange} placeholder="Video Title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" value={currentVideo.description} onChange={handleInputChange} placeholder="Video Description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video_url" className="text-right">Video URL</Label>
              <Input id="video_url" value={currentVideo.video_url} onChange={handleInputChange} placeholder="https://example.com/video.mp4" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="thumbnail_url" className="text-right">Thumbnail URL</Label>
              <Input id="thumbnail_url" value={currentVideo.thumbnail_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">Tags</Label>
              <Input id="tags" value={currentVideo.tags} onChange={handleInputChange} placeholder="e.g. tech, comedy, gaming" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meta_data" className="text-right">Meta Data (JSON)</Label>
              <Input id="meta_data" value={currentVideo.meta_data} onChange={handleInputChange} placeholder='e.g. {"seo_keywords": "keyword"}' className="col-span-3" />
            </div>
            <Button onClick={handleSaveVideo}>{isEditing ? 'Save Changes' : 'Save Video'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video: any) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>{video.views}</TableCell>
                  <TableCell>{video.uploaded}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenDialog(video)}><Edit className="w-4 h-4"/></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteVideo(video.id)}><Trash className="w-4 h-4"/></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
