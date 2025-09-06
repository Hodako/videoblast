// src/app/creators/page.tsx
import Header from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const creators = [
    { name: 'Casey Neistat', handle: '@casey', avatar: 'https://i.pravatar.cc/150?u=casey' },
    { name: 'MKBHD', handle: '@mkbhd', avatar: 'https://i.pravatar.cc/150?u=mkbhd' },
    { name: 'Lilly Singh', handle: '@lilly', avatar: 'https://i.pravatar.cc/150?u=lilly' },
    { name: 'Peter McKinnon', handle: '@petermckinnon', avatar: 'https://i.pravatar.cc/150?u=peter' },
    { name: 'MrBeast', handle: '@mrbeast', avatar: 'https://i.pravatar.cc/150?u=mrbeast' },
    { name: 'Dude Perfect', handle: '@dudeperfect', avatar: 'https://i.pravatar.cc/150?u=dudeperfect' },
];

export default function CreatorsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5">
        <h1 className="text-3xl font-bold mb-8">Top Creators</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {creators.map((creator) => (
            <Card key={creator.handle} className="p-4 flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={creator.avatar} />
                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-bold">{creator.name}</p>
                <p className="text-sm text-muted-foreground">{creator.handle}</p>
              </div>
              <Button variant="outline" size="sm">Follow</Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
