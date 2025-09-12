
// src/app/layout.tsx
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { getSiteSettings } from '@/lib/data';
import type { Metadata } from 'next';

// This function now fetches data from the API during the build process on the server.
async function getLayoutMetadata() {
  try {
    // Using the client-side data fetching function is fine here because Next.js
    // will run this on the server during the build and can fetch from the API URL.
    const settings = await getSiteSettings();
    return settings;
  } catch (error) {
    console.error("Failed to fetch settings for metadata, using defaults.", error);
    // Return a default object if the API is unavailable during build.
    return {
      theme: { primaryColor: '#FF4757', accentColor: '#E25822', fontFamily: 'PT Sans' },
      bannerText: "Welcome!",
      siteName: 'NosuTube',
      siteLogoUrl: '/logo.svg',
      siteMotto: 'Your universe of video content.'
    };
  }
}


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getLayoutMetadata();
  const siteName = settings?.siteName || 'NosuTube';
  const description = settings?.siteMotto || 'Your universe of video content.';
  const siteLogoUrl = settings?.siteLogoUrl || '/logo.svg';
  // Use a placeholder base URL or an environment variable if you have one for production.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
  const fullLogoUrl = siteLogoUrl.startsWith('http') ? siteLogoUrl : baseUrl + siteLogoUrl;

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: description,
    openGraph: {
      title: siteName,
      description: description,
      url: baseUrl,
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
  const settings = await getLayoutMetadata();
  
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
