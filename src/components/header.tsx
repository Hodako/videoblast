'use client';
import Link from 'next/link';
import { Menu, Search, UserCircle, ArrowLeft, Film, Settings, LogOut, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Header({ settings }) {
  const router = useRouter();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [user, setUser] = useState<{firstName?: string, email?: string, role?: string} | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
    setIsMobileSearchOpen(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const searchForm = (
    <form onSubmit={handleSearch} className="relative w-full">
       {isMobileSearchOpen && (
         <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground"
            onClick={() => setIsMobileSearchOpen(false)}
        >
            <ArrowLeft className="w-5 h-5" />
        </Button>
       )}
      <Input name="search" placeholder="Search..." className={cn("bg-muted", isMobileSearchOpen ? 'pr-10 pl-10' : 'pr-10')} />
      <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground">
        <Search className="w-4 h-4" />
      </Button>
    </form>
  );

  const navLinks = (
    <>
      <Link href="/videos" className="text-sm text-foreground hover:text-primary transition-colors">Videos</Link>
      <Link href="/shorts/0" className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-2">
        <Film className="w-5 h-5" /> Shorts
      </Link>
       <Link href="/images" className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-2">
        <ImageIcon className="w-5 h-5" /> Photos
      </Link>
      <Link href="/live" className="text-sm text-foreground hover:text-primary transition-colors">Live</Link>
      <Link href="/categories" className="text-sm text-foreground hover:text-primary transition-colors">Categories</Link>
      <Link href="/creators" className="text-sm text-foreground hover:text-primary transition-colors">Creators</Link>
      <Link href="/playlists" className="text-sm text-foreground hover:text-primary transition-colors">Playlists</Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-card px-4 sm:px-5 h-[60px] flex items-center justify-between border-b border-border gap-4">
       <div className={cn("flex items-center gap-8", { 'hidden': isMobileSearchOpen })}>
         <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          {settings?.siteLogoUrl ? (
            <Image src={settings.siteLogoUrl} alt={settings.siteName || 'Logo'} width={32} height={32} />
          ) : null}
          {settings?.siteName || 'StreamVerse'}
        </Link>
        <nav className="hidden lg:flex gap-8 list-none">
          {navLinks}
        </nav>
      </div>

      <div className={cn("flex-1 max-w-md hidden md:block", { 'block w-full': isMobileSearchOpen, 'hidden': !isMobileSearchOpen && isMobileSearchOpen !== null })}>
        {searchForm}
      </div>

      <div className={cn("flex items-center gap-2", { 'hidden': isMobileSearchOpen })}>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileSearchOpen(true)}>
            <Search className="w-5 h-5"/>
        </Button>

        {user ? (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <UserCircle className="w-6 h-6" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem disabled>{user.firstName}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                      <LogOut />
                      <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ) : (
          <>
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
          </>
        )}
        
        {user?.role === 'admin' && (
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <Settings />
            </Button>
          </Link>
        )}

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <VisuallyHidden>
                  <SheetTitle>Mobile Navigation</SheetTitle>
                </VisuallyHidden>
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
