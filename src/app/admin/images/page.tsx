// src/app/admin/images/page.tsx
'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addImage, deleteImage, getAdminImages } from "@/lib/data";
import { PlusCircle, Trash } from "lucide-react";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";

export default function AdminImagesPage() {
    const { toast } = useToast();
    const [images, setImages] = useState([]);
    const [newImage, setNewImage] = useState({ title: '', image_url: '' });

    const fetchImages = async () => {
        try {
            const imagesData = await getAdminImages();
            setImages(imagesData);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to load images." });
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleAddImage = async () => {
        try {
            await addImage(newImage);
            setNewImage({ title: '', image_url: '' });
            fetchImages();
            toast({ title: "Success", description: "Image added." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to add image." });
        }
    };

    const handleDeleteImage = async (id: number) => {
        try {
            await deleteImage(id);
            fetchImages();
            toast({ title: "Success", description: "Image deleted." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete image." });
        }
    };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Images</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Image</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Image</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image-url" className="text-right">Image URL</Label>
                <Input id="image-url" value={newImage.image_url} onChange={(e) => setNewImage({...newImage, image_url: e.target.value})} placeholder="https://example.com/image.jpg" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" value={newImage.title} onChange={(e) => setNewImage({...newImage, title: e.target.value})} placeholder="Image Title" className="col-span-3" />
              </div>
              <Button onClick={handleAddImage}>Save Image</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((photo: any) => (
                    <div key={photo.id} className="relative group">
                        <Image src={photo.image_url} alt={photo.title} width={400} height={400} className="rounded-lg object-cover aspect-square"/>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteImage(photo.id)}><Trash className="w-4 h-4"/></Button>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
