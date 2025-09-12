
// src/lib/server-data.ts
'use server';

import { prisma } from '@/lib/db';

/**
 * These functions are for SERVER-SIDE use only, primarily during the build process
 * or for server components. They access the database directly.
 */

export async function getVideos() {
    return prisma.video.findMany({
        orderBy: { uploaded: 'desc' },
         include: { creator: true, categories: { include: { category: true } } }
    });
}

export async function getShorts() {
    return prisma.short.findMany({ include: { creator: true }});
}

export async function getCategories() {
    return prisma.category.findMany({ orderBy: { name: 'asc' }});
}

export const getSiteSettings = async () => {
    try {
        const settings = await prisma.siteSetting.findUnique({
            where: { key: 'siteSettings' },
        });

        if (settings) {
            return settings.value as any;
        }

        // Return a default object if no settings are found in the database
        return {
          theme: { primaryColor: '#FF4757', accentColor: '#E25822', fontFamily: 'PT Sans' },
          banner: { text: "Welcome!", color: '#2ed573', enabled: false },
          siteName: 'NosuTube',
          siteLogoUrl: '/logo.svg',
          siteMotto: 'Your universe of video content.',
          showFeatured: true,
          featuredVideoIds: []
        };
    } catch (e) {
        console.error("Could not fetch site settings from DB, using fallback.", e);
        // Provide a sensible default structure to prevent crashes
        return {
          theme: { primaryColor: '#FF4757', accentColor: '#E25822', fontFamily: 'PT Sans' },
          banner: { text: "Welcome!", color: '#2ed573', enabled: false },
          siteName: 'NosuTube',
          siteLogoUrl: '/logo.svg',
          siteMotto: 'Your universe of video content.',
          showFeatured: true,
          featuredVideoIds: []
        };
    }
};
