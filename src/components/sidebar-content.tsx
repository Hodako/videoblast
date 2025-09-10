'use client';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { User, Heart, Palette } from 'lucide-react';

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">{title}</h3>
    {children}
  </div>
);

type SidebarContentProps = {
  onFilterChange: (filters: { types?: string[], category?: string, tag?: string, sortBy?: string }) => void;
  categories: any[];
  tags: string[];
};

export default function SidebarContent({ onFilterChange, categories, tags }: SidebarContentProps) {
  const [types, setTypes] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  const handleTypeChange = (type: string) => {
    const newTypes = types.includes(type) ? types.filter(t => t !== type) : [...types, type];
    setTypes(newTypes);
    onFilterChange({ types: newTypes });
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveTag(null);
    onFilterChange({ category: categoryId === 'all' ? null : categoryId, tag: null });
  }

  const handleTagClick = (tag: string) => {
    const newTag = tag === activeTag ? null : tag;
    setActiveTag(newTag);
    onFilterChange({ tag: newTag });
  }

  const handleSortChange = (sort: string) => {
    onFilterChange({ sortBy: sort });
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
              <Palette className="w-4 h-4" /> Trans
            </Label>
          </div>
        </div>
      </SidebarSection>
      
      <SidebarSection title="Sort by">
        <Select defaultValue="relevance" onValueChange={handleSortChange}>
          <SelectTrigger className="w-full bg-muted border-none">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </SidebarSection>

      <SidebarSection title="Filter by Categories">
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full bg-muted border-none">
            <SelectValue placeholder="Choose category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat: any) => (
               <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarSection>
      
      <SidebarSection title="Tags">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge 
              key={tag} 
              variant={tag === activeTag ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/20" 
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </SidebarSection>
    </div>
  );
}
