'use server';
/**
 * @fileOverview An AI flow to generate SEO-optimized titles and descriptions for videos.
 *
 * - getSEOSuggestions - A function that handles the SEO suggestion process.
 * - SEOSuggestionsInput - The input type for the getSEOSuggestions function.
 * - SEOSuggestionsOutput - The return type for the getSEOSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SEOSuggestionsInputSchema = z.object({
  currentTitle: z.string().describe('The current title of the video.'),
  currentDescription: z.string().describe('The current description of the video.'),
  tags: z.array(z.string()).optional().describe('A list of tags associated with the video.'),
});
export type SEOSuggestionsInput = z.infer<typeof SEOSuggestionsInputSchema>;

export const SEOSuggestionsOutputSchema = z.object({
    titleSuggestions: z.array(z.string()).describe('An array of 3 SEO-optimized title suggestions.'),
    descriptionSuggestions: z.array(z.string()).describe('An array of 2 SEO-optimized description suggestions, each under 160 characters.'),
});
export type SEOSuggestionsOutput = z.infer<typeof SEOSuggestionsOutputSchema>;


export async function getSEOSuggestions(input: SEOSuggestionsInput): Promise<SEOSuggestionsOutput> {
  return seoSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seoSuggestionsPrompt',
  input: {schema: SEOSuggestionsInputSchema},
  output: {schema: SEOSuggestionsOutputSchema},
  prompt: `You are an expert YouTube and Google SEO strategist. Your task is to generate compelling, click-worthy, and keyword-rich SEO titles and descriptions for a video.

Analyze the provided video information:
- Current Title: {{{currentTitle}}}
- Current Description: {{{currentDescription}}}
{{#if tags}}
- Tags: {{{tags}}}
{{/if}}

Based on this information, provide:
1.  **Three (3)** alternative SEO-optimized titles. The titles should be engaging and include relevant keywords.
2.  **Two (2)** alternative SEO-optimized descriptions. Each description MUST be concise and under 160 characters to avoid truncation in search results. They should include a strong call-to-action and primary keywords.

Return the suggestions in the specified JSON format.`,
});

const seoSuggestionsFlow = ai.defineFlow(
  {
    name: 'seoSuggestionsFlow',
    inputSchema: SEOSuggestionsInputSchema,
    outputSchema: SEOSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
