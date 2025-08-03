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
    console.error('Error generando la sugerencia de diario:', error);
    return "Lo siento, no pude generar una sugerencia en este momento. ¿Qué tal si escribes sobre tu recuerdo favorito?";
  }
}
