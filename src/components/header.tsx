import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Header() {
  return (
    <header className="bg-card px-5 h-[60px] flex items-center justify-between border-b border-border">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-primary">
          VideoHub
        </Link>
        <nav className="hidden lg:flex gap-8 list-none">
          <Link href="#" className="text-sm text-foreground hover:text-primary transition-colors">Videos</Link>
          <Link href="#" className="text-sm text-foreground hover:text-primary transition-colors">Live</Link>
          <Link href="#" className="text-sm text-foreground hover:text-primary transition-colors">Categories</Link>
          <Link href="#" className="text-sm text-foreground hover:text-primary transition-colors">Creators</Link>
          <Link href="#" className="text-sm text-foreground hover:text-primary transition-colors">Channels</Link>
          <Link href="#" className="text-sm text-foreground hover:text-primary transition-colors">Playlists</Link>
        </nav>
      </div>
      <div className="flex-1 max-w-md mx-5 hidden sm:block">
        <div className="relative">
          <Input placeholder="Search..." className="bg-muted pr-10" />
          <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">Login</Button>
        <Button>Sign up for free</Button>
      </div>
    </header>
  );
}
