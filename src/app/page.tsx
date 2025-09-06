import Header from '@/components/header';
import PromoBanner from '@/components/promo-banner';
import SidebarContent from '@/components/sidebar-content';
import MainContent from '@/components/main-content';

export default function Home() {
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
    </div>
  );
}
