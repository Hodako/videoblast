// src/app/creators/page.tsx
'use client'
import Header from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getCreators } from '@/lib/data';
import { useEffect, useState } from 'react';

export default function CreatorsPage() {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const data = await getCreators();
        setCreators(data);
      } catch (error) {
        console.error("Failed to fetch creators:", error);
      }
    };
    fetchCreators();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5">
        <h1 className="text-3xl font-bold mb-8">Top Creators</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {creators.map((creator: any) => (
            <Card key={creator.id} className="p-4 flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={creator.image_url} />
                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-bold">{creator.name}</p>
                <p className="text-sm text-muted-foreground">{creator.description}</p>
              </div>
              <Button variant="outline" size="sm">Follow</Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
