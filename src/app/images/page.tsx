// src/app/images/page.tsx
'use client'
import { useEffect, useState } from "react";
import { getAdminImages } from "@/lib/data";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminImagesPage() {
    const { toast } = useToast();
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchImages = async () => {
        setIsLoading(true);
        try {
            const imagesData = await getAdminImages();
            setImages(imagesData);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to load images." });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5">
        <h1 className="text-3xl font-bold mb-8">Photos</h1>
         {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="rounded-lg aspect-square w-full" />
                ))}
            </div>
         ) : images.length > 0 ? (
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((photo: any) => (
                            <div key={photo.id} className="relative group aspect-square">
                                <Image src={photo.image_url} alt={photo.title} fill className="rounded-lg object-cover"/>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                   <p className="text-white text-center">{photo.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        ) : (
             <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No photos found.</p>
            </div>
        )}
      </main>
    </div>
  )
}
