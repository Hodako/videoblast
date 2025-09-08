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
import { getAdminVideos, addVideo, updateVideo, deleteVideo, getAdminCategories } from "@/lib/data";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';

export default function AdminVideosPage() {
  const { toast } = useToast();
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({
    id: null,
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    tags: '',
    meta_data: { seo_title: '', seo_description: ''},
    subtitle: 'Admin Upload',
    duration: '0:00',
    views: '0',
    uploaded: new Date().toISOString(),
    categoryIds: [],
    type: 'straight'
  });

  const fetchVideos = async () => {
    try {
      const data = await getAdminVideos();
      setVideos(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load videos." });
    }
  };
  
  const fetchCategories = async () => {
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load categories." });
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  const handleOpenDialog = (video = null) => {
    if (video) {
      setIsEditing(true);
      setCurrentVideo({
        ...video,
        tags: Array.isArray(video.tags) ? video.tags.join(', ') : '',
        meta_data: video.meta_data ? (typeof video.meta_data === 'string' ? JSON.parse(video.meta_data) : video.meta_data) : { seo_title: '', seo_description: '' },
        categoryIds: video.categories?.map(c => c.id) || []
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
        meta_data: { seo_title: '', seo_description: ''},
        subtitle: 'Admin Upload',
        duration: '0:00',
        views: '0',
        uploaded: new Date().toISOString(),
        categoryIds: [],
        type: 'straight'
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleSaveVideo = async () => {
    if (!currentVideo.title.trim() || !currentVideo.video_url.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Title and Video URL are required." });
      return;
    }
    
    const videoPayload = {
      ...currentVideo,
      tags: currentVideo.tags.split(',').map(tag => tag.trim()),
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

  const handleMetaDataChange = (e) => {
    const { id, value } = e.target;
    setCurrentVideo(prev => ({ ...prev, meta_data: { ...prev.meta_data, [id]: value } }));
  }

  const handleCategoryChange = (categoryId, checked) => {
    setCurrentVideo(prev => {
        const newCategoryIds = checked
            ? [...prev.categoryIds, categoryId]
            : prev.categoryIds.filter(id => id !== categoryId);
        return { ...prev, categoryIds: newCategoryIds };
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Videos</h1>
        <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add Video</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select value={currentVideo.type} onValueChange={(value) => setCurrentVideo(prev => ({...prev, type: value}))}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="straight">Straight</SelectItem>
                    <SelectItem value="gay">Gay</SelectItem>
                    <SelectItem value="trans">Trans</SelectItem>
                </SelectContent>
              </Select>
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
             <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Categories</Label>
                <div className="col-span-3 space-y-2 max-h-40 overflow-y-auto border p-2 rounded-md">
                    {categories.map((category: any) => (
                        <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`cat-${category.id}`}
                                checked={currentVideo.categoryIds.includes(category.id)}
                                onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                            />
                            <Label htmlFor={`cat-${category.id}`}>{category.name}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="seo_title" className="text-right">SEO Title</Label>
              <Input id="seo_title" value={currentVideo.meta_data.seo_title} onChange={handleMetaDataChange} placeholder="Title for search engines" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="seo_description" className="text-right">SEO Description</Label>
              <Textarea id="seo_description" value={currentVideo.meta_data.seo_description} onChange={handleMetaDataChange} placeholder="Description for search engines" className="col-span-3" />
            </div>
            <Button onClick={handleSaveVideo}>{isEditing ? 'Save Changes' : 'Save Video'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video: any) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>{video.views}</TableCell>
                  <TableCell>{format(new Date(video.uploaded), "PP")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
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
