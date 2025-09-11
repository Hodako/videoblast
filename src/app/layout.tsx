// src/app/layout.tsx
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { getSiteSettings } from '@/lib/server-data';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || 'StreamVerse';
  const description = settings?.siteMotto || 'Your universe of video content.';
  const siteLogoUrl = settings?.siteLogoUrl || '/logo.svg';
  const fullLogoUrl = siteLogoUrl.startsWith('http') ? siteLogoUrl : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002') + siteLogoUrl;

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: description,
    openGraph: {
      title: siteName,
      description: description,
      url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002',
      siteName: siteName,
      images: [
        {
          url: fullLogoUrl,
          width: 1200,
          height: 630,
          alt: 'Site Logo'
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
     twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: description,
      images: [fullLogoUrl],
    },
    icons: {
      icon: settings?.siteLogoUrl || '/favicon.ico',
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {settings?.theme?.fontFamily && (
          <link href={`https://fonts.googleapis.com/css2?family=${settings.theme.fontFamily.replace(/ /g, '+')}:ital,wght@0,400;0,700;1,400;1,700&display=swap`} rel="stylesheet" />
        )}
      </head>
      <body className="font-body antialiased" style={{ fontFamily: settings?.theme?.fontFamily || 'PT Sans, sans-serif' }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
