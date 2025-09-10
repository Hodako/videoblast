// src/app/layout.tsx
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { getSiteSettings } from '@/lib/data';

// This function can be uncommented if you need to fetch settings for every page.
// export async function generateMetadata() {
//   const settings = await getSiteSettings();
//   return {
//     title: settings?.siteName || 'StreamVerse',
//     description: settings?.siteMotto || 'Your universe of video content.',
//   };
// }

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  
  return (
    <html lang="en" className="dark">
      <head>
        <title>{settings?.siteName || 'StreamVerse'}</title>
        <meta name="description" content={settings?.siteMotto || 'Your universe of video content.'} />
        {settings?.siteLogoUrl && <link rel="icon" href={settings.siteLogoUrl} sizes="any" />}
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
