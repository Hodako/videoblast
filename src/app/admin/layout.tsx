// src/app/admin/layout.tsx
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Settings, Video, Film, ImageIcon, BarChart2, List, User, Tag, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import { useEffect, useState } from 'react';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart2 },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/shorts', label: 'Shorts', icon: Film },
  { href: '/admin/images', label: 'Images', icon: ImageIcon },
  { href: '/admin/playlists', label: 'Playlists', icon: List },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/creators', label: 'Creators', icon: User },
  { href: '/admin/seo', label: 'AI SEO Assistant', icon: Sparkles },
  { href: '/admin/customize', label: 'Customize', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user.role === 'admin') {
        setIsAllowed(true);
      } else {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!isAllowed) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <aside className="w-64 shrink-0 border-r border-border p-4">
          <nav className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <Home className="w-4 h-4" />
              Back to Site
            </Link>
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname.startsWith(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
