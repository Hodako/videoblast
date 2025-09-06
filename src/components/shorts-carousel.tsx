import { shorts } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ShortsCard from './shorts-card';
import { Film } from 'lucide-react';

export default function ShortsCarousel() {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
        <Film className="w-6 h-6 text-primary" />
        Shorts
      </h2>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {shorts.map((short, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8">
              <ShortsCard short={short} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-12 hidden md:flex" />
        <CarouselNext className="mr-12 hidden md:flex" />
      </Carousel>
    </section>
  );
}
