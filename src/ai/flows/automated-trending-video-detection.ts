// src/ai/flows/automated-trending-video-detection.ts
'use server';

/**
 * @fileOverview Automatically detects trending videos based on views and engagement metrics.
 *
 * - detectTrendingVideos - A function that initiates the trending video detection process.
 * - DetectTrendingVideosInput - The input type for the detectTrendingVideos function.
 * - DetectTrendingVideosOutput - The return type for the detectTrendingVideos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectTrendingVideosInputSchema = z.object({
  videoTitles: z.array(z.string()).describe('A list of video titles to analyze for trending status.'),
  viewCounts: z.array(z.number()).describe('A list of view counts corresponding to the video titles.'),
  engagementMetrics: z
    .array(z.number())
    .describe('A list of engagement metrics (e.g., likes, comments, shares) corresponding to the video titles.'),
});
export type DetectTrendingVideosInput = z.infer<typeof DetectTrendingVideosInputSchema>;

const DetectTrendingVideosOutputSchema = z.object({
  trendingVideos: z
    .array(z.string())
    .describe('A list of video titles identified as trending based on the analysis of views and engagement.'),
});
export type DetectTrendingVideosOutput = z.infer<typeof DetectTrendingVideosOutputSchema>;

export async function detectTrendingVideos(input: DetectTrendingVideosInput): Promise<DetectTrendingVideosOutput> {
  return detectTrendingVideosFlow(input);
}

const trendingVideosPrompt = ai.definePrompt({
  name: 'trendingVideosPrompt',
  input: {schema: DetectTrendingVideosInputSchema},
  output: {schema: DetectTrendingVideosOutputSchema},
  prompt: `You are an expert in identifying trending videos based on their popularity and engagement.

  Analyze the following list of videos, their view counts, and engagement metrics to determine which videos are currently trending.

  Videos: {{videoTitles}}
  Views: {{viewCounts}}
  Engagement Metrics: {{engagementMetrics}}

  Consider a video trending if it has significantly high views and engagement compared to the others.
  Return only the titles of the videos that are trending.

  Trending Videos:`,
});

const detectTrendingVideosFlow = ai.defineFlow(
  {
    name: 'detectTrendingVideosFlow',
    inputSchema: DetectTrendingVideosInputSchema,
    outputSchema: DetectTrendingVideosOutputSchema,
  },
  async input => {
    const {output} = await trendingVideosPrompt(input);
    return output!;
  }
);
