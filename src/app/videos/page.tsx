// src/app/videos/page.tsx
'use client'
import { Suspense } from 'react';
import VideosComponent from '@/components/videos-component';

export default function VideosPage() {
  return (
    <Suspense fallback={<div>Loading videos...</div>}>
      <VideosComponent />
    </Suspense>
  );
}
