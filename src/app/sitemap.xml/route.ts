// src/app/sitemap.xml/route.ts
import { getVideos, getShorts, getCategories } from '@/lib/data';

const URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

function generateSitemap(videos, shorts, categories) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static pages -->
     <url>
       <loc>${URL}</loc>
     </url>
     <url>
       <loc>${URL}/videos</loc>
     </url>
      <url>
       <loc>${URL}/categories</loc>
     </url>
      <url>
       <loc>${URL}/creators</loc>
     </url>
      <url>
       <loc>${URL}/playlists</loc>
     </url>
      <url>
       <loc>${URL}/live</loc>
     </url>

     <!-- Dynamic pages -->
     ${videos
       .map(({ slug, uploaded }) => {
         return `
           <url>
               <loc>${`${URL}/watch/${slug}`}</loc>
               <lastmod>${new Date(uploaded).toISOString()}</lastmod>
           </url>
         `;
       })
       .join('')}
    ${shorts
       .map(({ id }) => {
         return `
           <url>
               <loc>${`${URL}/shorts/${id}`}</loc>
           </url>
         `;
       })
       .join('')}
    ${categories
       .map(({ name }) => {
         // Assuming you have a route for /categories/[name]
         return `
           <url>
               <loc>${`${URL}/categories?category=${name.toLowerCase()}`}</loc>
           </url>
         `;
       })
       .join('')}
   </urlset>
 `;
}

export async function GET() {
  const [videos, shorts, categories] = await Promise.all([
    getVideos(),
    getShorts(),
    getCategories()
  ]);

  const body = generateSitemap(videos, shorts, categories);

  return new Response(body, {
    status: 200,
    headers: {
      'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
      'content-type': 'application/xml',
    },
  });
}
