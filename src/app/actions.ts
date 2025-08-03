'use server';

import { generateJournalPrompt as generateJournalPromptFlow } from '@/ai/flows/generate-journal-prompt';
import type { GenerateJournalPromptInput } from '@/ai/flows/generate-journal-prompt';

export async function generateJournalPrompt(
  input: GenerateJournalPromptInput
): Promise<string> {
  try {
    const result = await generateJournalPromptFlow(input);
    return result.prompt;
  } catch (error) {
    console.error('Error generating journal prompt:', error);
    return "Sorry, I couldn't generate a prompt right now. How about writing about your favorite memory?";
  }
}
