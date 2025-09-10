// src/app/robots.txt/route.ts
import {NextResponse} from 'next/server';

export function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml
`;
  return new NextResponse(robotsTxt, {headers: {'Content-Type': 'text/plain'}});
}
