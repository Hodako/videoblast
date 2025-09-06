'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import PromoBanner from '@/components/promo-banner';
import SidebarContent from '@/components/sidebar-content';
import MainContent from '@/components/main-content';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';
import Link from 'next/link';
import { useWindowScroll } from 'react-use';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


export default function Home() {
  const { y } = useWindowScroll();
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastY, setLastY] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (y > lastY) {
      setIsScrollingDown(true);
    } else {
      setIsScrollingDown(false);
    }
    setLastY(y);
  }, [y, lastY]);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <PromoBanner />
      <div className="flex flex-col md:flex-row">
        <aside className="w-full shrink-0 md:w-[250px] bg-card p-5 border-r-0 md:border-r border-border md:order-1 order-2">
          <SidebarContent />
        </aside>
        <main className="flex-1 p-5 md:order-2 order-1">
          <MainContent />
        </main>
      </div>

       {isMobile && (
         <Link href="/shorts/0" passHref>
          <Button
            className={cn(
              "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full shadow-lg transition-transform transform",
              isScrollingDown ? "translate-y-24" : "translate-y-0"
            )}
          >
            <Film className="mr-2 h-5 w-5" />
            Shorts
          </Button>
         </Link>
      )}
    </div>
  );
}
