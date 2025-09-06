'use client';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">{title}</h3>
    {children}
  </div>
);

export default function SidebarContent() {
  const [orientation, setOrientation] = useState('all');
  const tags = ["Gaming", "Music", "Vlogs", "Sports", "Travel", "Tech", "Comedy"];

  return (
    <div className="space-y-8">
      <SidebarSection title="Filter by Orientation">
        <ul className="space-y-2">
          {['All', 'Landscape', 'Portrait'].map((item) => (
            <li key={item} 
                onClick={() => setOrientation(item.toLowerCase())}
                className={`text-sm cursor-pointer transition-colors ${orientation === item.toLowerCase() ? 'text-primary font-semibold' : 'text-foreground/80 hover:text-primary'}`}>
              {item}
            </li>
          ))}
        </ul>
      </SidebarSection>
      
      <SidebarSection title="Sort by">
        <Select defaultValue="relevance">
          <SelectTrigger className="w-full bg-muted border-none">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="viewed">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </SidebarSection>

      <SidebarSection title="Filter by Categories">
        <Select>
          <SelectTrigger className="w-full bg-muted border-none">
            <SelectValue placeholder="Choose category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gaming">Gaming</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="comedy">Comedy</SelectItem>
            <SelectItem value="documentary">Documentary</SelectItem>
          </SelectContent>
        </Select>
      </SidebarSection>
      
      <SidebarSection title="Duration (min)">
        <Select defaultValue="any">
          <SelectTrigger className="w-full bg-muted border-none">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="under5">Under 5 min</SelectItem>
            <SelectItem value="5-20">5-20 min</SelectItem>
            <SelectItem value="over20">20+ min</SelectItem>
          </SelectContent>
        </Select>
      </SidebarSection>
      
      <SidebarSection title="Date">
        <Select defaultValue="all">
          <SelectTrigger className="w-full bg-muted border-none">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>
      </SidebarSection>

      <SidebarSection title="Tags">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary/20">{tag}</Badge>)}
        </div>
      </SidebarSection>
    </div>
  );
}
