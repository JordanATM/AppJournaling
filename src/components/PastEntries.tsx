'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { JournalEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PastEntriesProps {
  entries: JournalEntry[];
}

export default function PastEntries({ entries }: PastEntriesProps) {
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Reflexiones Pasadas</CardTitle>
        <CardDescription>Una mirada retrospectiva a tu viaje.</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedEntries.length > 0 ? (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {sortedEntries.map(entry => (
                <div key={entry.id} className="p-4 border rounded-lg bg-background/50">
                  <p className="font-semibold text-sm text-muted-foreground mb-1">
                    {format(parseISO(entry.date), 'd \'de\' MMMM \'de\' yyyy', { locale: es })}
                  </p>
                  <p className="text-foreground/90 whitespace-pre-wrap line-clamp-3">
                    {entry.content}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>No se encontraron entradas.</p>
            <p className="text-sm">Comienza a escribir para ver tus reflexiones pasadas aquí.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
