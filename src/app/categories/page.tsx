// src/app/categories/page.tsx
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'lucide-react';

const categories = ["Gaming", "Music", "Vlogs", "Sports", "Travel", "Tech", "Comedy", "Education", "DIY", "Cooking", "Fashion", "Movies"];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5">
        <h1 className="text-3xl font-bold mb-8">Categories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card key={category} className="bg-card hover:bg-muted transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Tag className="w-10 h-10 text-primary mb-3" />
                <p className="font-semibold">{category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
