// src/app/admin/shorts/page.tsx
'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminShorts, addShort, updateShort, deleteShort, getAdminCreators } from "@/lib/data";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

export default function AdminShortsPage() {
  const { toast } = useToast();
  const [shorts, setShorts] = useState([]);
  const [creators, setCreators] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentShort, setCurrentShort] = useState({
    id: null,
    title: '',
    video_url: '',
    thumbnail_url: '',
    creator_id: '',
    slug: '',
  });

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

  const handleOpenDialog = (short = null) => {
    if (short) {
      setIsEditing(true);
      setCurrentShort({
        ...short,
        creator_id: short.creator_id?.toString() ?? '',
      });
    } else {
      setIsEditing(false);
      setCurrentShort({ id: null, title: '', video_url: '', thumbnail_url: '', creator_id: '', slug: '' });
    }
    setIsDialogOpen(true);
  };
  
  const handleSaveShort = async () => {
    const payload = { ...currentShort, creator_id: currentShort.creator_id ? parseInt(currentShort.creator_id, 10) : null };
    try {
      if (isEditing) {
        await updateShort(payload);
        toast({ title: "Success", description: "Short updated." });
      } else {
        await addShort(payload);
        toast({ title: "Success", description: "Short added." });
      }
      fetchShorts();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Failed to save short: ${error.message}` });
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
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCurrentShort(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Shorts</h1>
         <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add Short</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Short' : 'Add New Short'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" value={currentShort.title} onChange={handleInputChange} placeholder="Shorts Title" className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="video_url" className="text-right">Video URL</Label>
                <Input id="video_url" value={currentShort.video_url} onChange={handleInputChange} placeholder="https://example.com/video.mp4" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="thumbnail_url" className="text-right">Thumbnail URL</Label>
                <Input id="thumbnail_url" value={currentShort.thumbnail_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="creator_id" className="text-right">Creator</Label>
                 <Select value={currentShort.creator_id || ''} onValueChange={(value) => setCurrentShort({...currentShort, creator_id: value})}>
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
              <Button onClick={handleSaveShort}>{isEditing ? 'Save Changes' : 'Save Short'}</Button>
            </div>
          </DialogContent>
        </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shorts.map((short: any) => (
                <TableRow key={short.id}>
                   <TableCell>
                    {short.thumbnail_url && <Image src={short.thumbnail_url} alt={short.title} width={36} height={64} className="rounded-sm object-cover" />}
                  </TableCell>
                  <TableCell className="font-medium">{short.title}</TableCell>
                  <TableCell>{short.creator?.name || 'N/A'}</TableCell>
                  <TableCell>{short.views}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon" onClick={() => handleOpenDialog(short)}><Edit className="w-4 h-4"/></Button>
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
