'use server';

/**
 * @fileOverview Generates personalized journal prompts using previous journal entries.
 *
 * - generateJournalPrompt - A function that generates a journal prompt.
 * - GenerateJournalPromptInput - The input type for the generateJournalPrompt function.
 * - GenerateJournalPromptOutput - The return type for the generateJournalPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJournalPromptInputSchema = z.object({
  previousEntries: z
    .string()
    .describe('The user\'s previous journal entries, separated by newlines.'),
});
export type GenerateJournalPromptInput = z.infer<typeof GenerateJournalPromptInputSchema>;

const GenerateJournalPromptOutputSchema = z.object({
  prompt: z.string().describe('A personalized journal prompt based on previous entries.'),
});
export type GenerateJournalPromptOutput = z.infer<typeof GenerateJournalPromptOutputSchema>;

export async function generateJournalPrompt(
  input: GenerateJournalPromptInput
): Promise<GenerateJournalPromptOutput> {
  return generateJournalPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJournalPromptPrompt',
  input: {schema: GenerateJournalPromptInputSchema},
  output: {schema: GenerateJournalPromptOutputSchema},
  prompt: `You are a helpful AI assistant designed to generate personalized journal prompts.

  Based on the user's previous journal entries, suggest a new and engaging journal prompt to encourage further reflection.
  The prompt should be tailored to the user's interests, experiences, and emotional state as reflected in their writing.
  The prompt should be open-ended and encourage the user to explore their thoughts and feelings in a meaningful way.

  Previous entries:
  {{#if previousEntries}}
  {{{previousEntries}}}
  {{else}}
  The user has no previous journal entries.
  {{/if}}

  Generated Prompt:`,
});

const generateJournalPromptFlow = ai.defineFlow(
  {
    name: 'generateJournalPromptFlow',
    inputSchema: GenerateJournalPromptInputSchema,
    outputSchema: GenerateJournalPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
