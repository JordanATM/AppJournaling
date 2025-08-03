'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { JournalEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface PastEntriesProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entryId: string) => void;
}

export default function PastEntries({ entries, onEdit, onDelete }: PastEntriesProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Reflexiones Pasadas</CardTitle>
        <CardDescription>Una mirada retrospectiva a tu viaje.</CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length > 0 ? (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {entries.map(entry => (
                <div key={entry.id} className="p-4 border rounded-lg bg-background/50 group relative">
                  <p className="font-semibold text-sm text-muted-foreground mb-1">
                    {format(parseISO(entry.date), 'd \'de\' MMMM \'de\' yyyy', { locale: es })}
                  </p>
                  <p className="text-foreground/90 whitespace-pre-wrap line-clamp-3">
                    {entry.content}
                  </p>
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-7 w-7"
                       onClick={() => onEdit(entry)}
                       aria-label={`Editar entrada del ${entry.date}`}
                     >
                        <Pencil className="h-4 w-4" />
                     </Button>
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                       onClick={() => onDelete(entry.id)}
                       aria-label={`Eliminar entrada del ${entry.date}`}
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
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
