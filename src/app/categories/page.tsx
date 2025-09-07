// src/app/categories/page.tsx
'use client'
import Header from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/data';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-5">
        <h1 className="text-3xl font-bold mb-8">Categories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category: any) => (
            <Card key={category.id} className="bg-card hover:bg-muted transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Tag className="w-10 h-10 text-primary mb-3" />
                <p className="font-semibold">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
