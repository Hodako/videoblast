// src/app/admin/shorts/page.tsx
'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminShorts, addShort, deleteShort, getAdminCreators } from "@/lib/data";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminShortsPage() {
  const { toast } = useToast();
  const [shorts, setShorts] = useState([]);
  const [creators, setCreators] = useState([]);
  const [newShort, setNewShort] = useState({ title: '', video_url: '', thumbnail_url: '', creator_id: null });

  const fetchShorts = async () => {
    try {
      const data = await getAdminShorts();
      setShorts(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load shorts." });
    }
  };

  const fetchCreators = async () => {
    try {
      const creatorData = await getAdminCreators();
      setCreators(creatorData);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load creators." });
    }
  };

  useEffect(() => {
    fetchShorts();
    fetchCreators();
  }, []);

  const handleAddShort = async () => {
    const payload = { ...newShort, creator_id: newShort.creator_id ? parseInt(newShort.creator_id, 10) : null };
    try {
      await addShort(payload);
      setNewShort({ title: '', video_url: '', thumbnail_url: '', creator_id: null });
      fetchShorts();
      toast({ title: "Success", description: "Short added." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to add short." });
    }
  };

  const handleDeleteShort = async (id: number) => {
    try {
      await deleteShort(id);
      fetchShorts();
      toast({ title: "Success", description: "Short deleted." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete short." });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Shorts</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Short</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Short</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" value={newShort.title} onChange={(e) => setNewShort({...newShort, title: e.target.value})} placeholder="Shorts Title" className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="video-src" className="text-right">Video URL</Label>
                <Input id="video-src" value={newShort.video_url} onChange={(e) => setNewShort({...newShort, video_url: e.target.value})} placeholder="https://example.com/video.mp4" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="thumbnail-url" className="text-right">Thumbnail URL</Label>
                <Input id="thumbnail-url" value={newShort.thumbnail_url} onChange={(e) => setNewShort({...newShort, thumbnail_url: e.target.value})} placeholder="https://example.com/image.jpg" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="creator_id" className="text-right">Creator</Label>
                 <Select value={newShort.creator_id?.toString() ?? ''} onValueChange={(value) => setNewShort({...newShort, creator_id: value})}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select creator" />
                    </SelectTrigger>
                    <SelectContent>
                        {creators.map((creator: any) => (
                        <SelectItem key={creator.id} value={creator.id.toString()}>{creator.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddShort}>Save Short</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shorts.map((short: any) => (
                <TableRow key={short.id}>
                  <TableCell className="font-medium">{short.title}</TableCell>
                  <TableCell>{short.creator?.name || 'N/A'}</TableCell>
                  <TableCell>{short.views}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                        {/* <Button variant="outline" size="icon"><Edit className="w-4 h-4"/></Button> */}
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteShort(short.id)}><Trash className="w-4 h-4"/></Button>
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
