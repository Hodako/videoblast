// src/app/channels/page.tsx
import Header from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const channels = [
  { name: 'Blender Foundation', banner: 'https://picsum.photos/seed/blender/600/150', thumbnail: 'sintel movie' },
  { name: 'Google', banner: 'https://picsum.photos/seed/google/600/150', thumbnail: 'bigger escape' },
  { name: 'The Smoking Tire', banner: 'https://picsum.photos/seed/smokingtire/600/150', thumbnail: 'subaru street' },
  { name: 'National Geographic', banner: 'https://picsum.photos/seed/natgeo/600/150', thumbnail: 'wildlife documentary' },
  { name: 'TED', banner: 'https://picsum.photos/seed/ted/600/150', thumbnail: 'tech talk' },
  { name: 'IGN', banner: 'https://picsum.photos/seed/ign/600/150', thumbnail: 'video game' },
];

export default function ChannelsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5">
        <h1 className="text-3xl font-bold mb-8">Channels</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <Card key={channel.name} className="overflow-hidden">
              <div className="relative h-24 w-full">
                <Image src={channel.banner} alt={`${channel.name} banner`} layout="fill" objectFit="cover" data-ai-hint={channel.thumbnail} />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold">{channel.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">12M Subscribers</p>
                <Button className="w-full">Subscribe</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
