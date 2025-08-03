'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Sparkles, LoaderCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateJournalPrompt } from '@/app/actions';
import type { JournalEntry } from '@/lib/types';

interface JournalEditorProps {
  selectedDate: Date;
  onSave: (content: string) => void;
}

export default function JournalEditor({ selectedDate, onSave }: JournalEditorProps) {
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  // This state is just to get previous entries for the prompt, not for rendering
  const [previousEntriesForPrompt, setPreviousEntriesForPrompt] = useState<JournalEntry[]>([]);


  useEffect(() => {
    // Clear content and prompt when selected date changes, but not the entries for prompt generation.
    setContent('');
    setPrompt(null);
  }, [selectedDate]);

  const handleSave = () => {
    onSave(content);
    setContent('');
    setPrompt(null);
    toast({
      title: "Entrada Guardada",
      description: `Tu nueva entrada para el ${format(selectedDate, 'd \'de\' MMMM \'de\' yyyy', { locale: es })} ha sido guardada.`,
    });
  };

  const handleGetPrompt = () => {
    startTransition(async () => {
       // This part of the component is not ideal, as it's not receiving entries.
       // For now, we will generate a generic prompt if no entries are available.
       // A better implementation would involve lifting state up or using a global state manager.
      const entriesText = previousEntriesForPrompt
        .map(e => e.content)
        .join('\n\n---\n\n');
      
      const generatedPrompt = await generateJournalPrompt({ previousEntries: entriesText });
      setPrompt(generatedPrompt);
    });
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">
          Nueva Reflexión
        </CardTitle>
        <CardDescription>
          Tu espacio para la reflexión para el {format(selectedDate, 'd \'de\' MMMM \'de\' yyyy', { locale: es })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {prompt && (
          <div className="p-3 bg-accent/50 border-l-4 border-accent rounded-r-md">
            <p className="font-semibold text-accent-foreground">{prompt}</p>
          </div>
        )}
        <Textarea
          placeholder="¿Qué tienes en mente?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] text-base leading-relaxed bg-background"
          aria-label="Área de texto para la entrada del diario"
        />
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={handleGetPrompt} disabled={isPending}>
          {isPending ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Obtener Sugerencia
        </Button>
        <Button onClick={handleSave} disabled={isPending || !content.trim()}>Guardar Entrada</Button>
      </CardFooter>
    </Card>
  );
}
