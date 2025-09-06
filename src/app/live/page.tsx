// src/app/live/page.tsx
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

export default function LivePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5 flex flex-col items-center justify-center text-center min-h-[calc(100vh-60px)]">
        <Camera className="w-24 h-24 text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-2">Live Streaming</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          This feature is coming soon! Get ready to broadcast your content to the world and engage with your audience in real-time.
        </p>
        <Button size="lg">Notify Me</Button>
      </main>
    </div>
  );
}
