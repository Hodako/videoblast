'use server';

/**
 * @fileOverview Personalized video suggestions based on user viewing history and preferences.
 *
 * - getVideoSuggestions - A function that generates personalized video suggestions.
 * - VideoSuggestionsInput - The input type for the getVideoSuggestions function.
 * - VideoSuggestionsOutput - The return type for the getVideoSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VideoSuggestionsInputSchema = z.object({
  viewingHistory: z
    .array(z.string())
    .describe('Array of video titles the user has watched.'),
  preferredTags: z.array(z.string()).describe('Array of tags the user prefers.'),
  preferredCategories: z
    .array(z.string())
    .describe('Array of categories the user prefers.'),
});
export type VideoSuggestionsInput = z.infer<typeof VideoSuggestionsInputSchema>;

const VideoSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('Array of suggested video titles based on user preferences.'),
});
export type VideoSuggestionsOutput = z.infer<typeof VideoSuggestionsOutputSchema>;

export async function getVideoSuggestions(
  input: VideoSuggestionsInput
): Promise<VideoSuggestionsOutput> {
  return videoSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'videoSuggestionsPrompt',
  input: {schema: VideoSuggestionsInputSchema},
  output: {schema: VideoSuggestionsOutputSchema},
  prompt: `You are a video recommendation expert.

Based on the user's viewing history, preferred tags, and preferred categories, suggest videos they might be interested in.  The response MUST be a JSON array of video titles.

Viewing History: {{viewingHistory}}
Preferred Tags: {{preferredTags}}
Preferred Categories: {{preferredCategories}}

Suggestions:`, //Ensure the prompt is well-formatted for JSON output
});

const videoSuggestionsFlow = ai.defineFlow(
  {
    name: 'videoSuggestionsFlow',
    inputSchema: VideoSuggestionsInputSchema,
    outputSchema: VideoSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
