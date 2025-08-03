'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface JournalEditorProps {
  selectedDate: Date;
  onSave: (content: string) => void;
}

export default function JournalEditor({
  selectedDate,
  onSave,
}: JournalEditorProps) {
  const [content, setContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setContent('');
  }, [selectedDate]);

  const handleSave = () => {
    onSave(content);
    setContent('');
    toast({
      title: "Entrada Guardada",
      description: `Tu nueva entrada para el ${format(selectedDate, 'd \'de\' MMMM \'de\' yyyy', { locale: es })} ha sido guardada.`,
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
        <Textarea
          placeholder="¿Qué tienes en mente?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] text-base leading-relaxed bg-background"
          aria-label="Área de texto para la entrada del diario"
        />
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button onClick={handleSave} disabled={!content.trim()}>Guardar Entrada</Button>
      </CardFooter>
    </Card>
  );
}
