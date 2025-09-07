'use client';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { User, Heart, Transgender } from 'lucide-react';

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">{title}</h3>
    {children}
  </div>
);

type SidebarContentProps = {
  onFilterChange: (filters: { types: string[] }) => void;
};

export default function SidebarContent({ onFilterChange }: SidebarContentProps) {
  const tags = ["Gaming", "Music", "Vlogs", "Sports", "Travel", "Tech", "Comedy"];
  const [types, setTypes] = useState<string[]>([]);

  const handleTypeChange = (type: string) => {
    const newTypes = types.includes(type) ? types.filter(t => t !== type) : [...types, type];
    setTypes(newTypes);
    onFilterChange({ types: newTypes });
  }

  return (
    <div className="space-y-8">
      <SidebarSection title="Filter by Type">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="straight" checked={types.includes('straight')} onCheckedChange={() => handleTypeChange('straight')} />
            <Label htmlFor="straight" className="flex items-center gap-2 text-sm font-normal cursor-pointer">
              <User className="w-4 h-4" /> Straight
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="gay" checked={types.includes('gay')} onCheckedChange={() => handleTypeChange('gay')} />
            <Label htmlFor="gay" className="flex items-center gap-2 text-sm font-normal cursor-pointer">
              <Heart className="w-4 h-4" /> Gay
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="trans" checked={types.includes('trans')} onCheckedChange={() => handleTypeChange('trans')} />
            <Label htmlFor="trans" className="flex items-center gap-2 text-sm font-normal cursor-pointer">
              <Transgender className="w-4 h-4" /> Trans
            </Label>
          </div>
        </div>
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
