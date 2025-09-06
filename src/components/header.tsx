'use client';
import Link from 'next/link';
import { Menu, Search, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function Header() {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const navLinks = (
    <>
      <Link href="/videos" className="text-sm text-foreground hover:text-primary transition-colors">Videos</Link>
      <Link href="/live" className="text-sm text-foreground hover:text-primary transition-colors">Live</Link>
      <Link href="/categories" className="text-sm text-foreground hover:text-primary transition-colors">Categories</Link>
      <Link href="/creators" className="text-sm text-foreground hover:text-primary transition-colors">Creators</Link>
      <Link href="/channels" className="text-sm text-foreground hover:text-primary transition-colors">Channels</Link>
      <Link href="/playlists" className="text-sm text-foreground hover:text-primary transition-colors">Playlists</Link>
    </>
  );

  return (
    <header className="bg-card px-5 h-[60px] flex items-center justify-between border-b border-border">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-primary">
          VideoHub
        </Link>
        <nav className="hidden lg:flex gap-8 list-none">
          {navLinks}
        </nav>
      </div>
      <div className="flex-1 max-w-md mx-5 hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <Input name="search" placeholder="Search..." className="bg-muted pr-10" />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground">
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign up for free</Link>
          </Button>
        </div>
        <div className="sm:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <UserCircle className="w-6 h-6" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild><Link href="/login">Login</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/signup">Sign Up</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks}
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
