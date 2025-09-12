// src/app/sitemap.ts
import { getVideos, getShorts, getCategories } from '@/lib/data';
import { MetadataRoute } from 'next';

const URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

// Note: This now fetches data from your live API during the build process.
// Ensure your backend is running and accessible when you build/deploy the frontend.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [videos, shorts, categories] = await Promise.all([
      getVideos(),
      getShorts(),
      getCategories()
    ]);

    const createSlug = (name: string) => name.toLowerCase().replace(/ /g, '-');

    const videoEntries: MetadataRoute.Sitemap = videos.map(({ slug, uploaded }) => ({
      url: `${URL}/watch/${slug}`,
      lastModified: new Date(uploaded),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const shortEntries: MetadataRoute.Sitemap = shorts.map(({ slug }) => ({
      url: `${URL}/shorts/${slug}`,
      changeFrequency: 'daily',
      priority: 0.7,
    }));
    
    const categoryEntries: MetadataRoute.Sitemap = categories.map(({ name }) => ({
      url: `${URL}/categories/${createSlug(name)}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    const staticPages: MetadataRoute.Sitemap = [
      { url: URL, changeFrequency: 'daily', priority: 1.0 },
      { url: `${URL}/videos`, changeFrequency: 'daily', priority: 0.9 },
      { url: `${URL}/categories`, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${URL}/creators`, changeFrequency: 'monthly', priority: 0.5 },
      { url: `${URL}/playlists`, changeFrequency: 'monthly', priority: 0.5 },
      { url: `${URL}/live`, changeFrequency: 'yearly', priority: 0.3 },
    ];

    return [
      ...staticPages,
      ...videoEntries,
      ...shortEntries,
      ...categoryEntries,
    ];
  } catch (error) {
    console.error("Failed to generate sitemap, returning empty array. Is the backend running?", error);
    return [];
  }
}

    