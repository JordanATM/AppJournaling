'use client';

import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { JournalEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import CalendarView from './CalendarView';

interface PastEntriesProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entryId: string) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const ENTRIES_PER_PAGE = 5;

export default function PastEntries({ entries, onEdit, onDelete, selectedDate, onDateSelect }: PastEntriesProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(entries.length / ENTRIES_PER_PAGE);

  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE;
    const endIndex = startIndex + ENTRIES_PER_PAGE;
    return entries.slice(startIndex, endIndex);
  }, [entries, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getEntryTimestamp = (entry: JournalEntry) => {
    const date = entry.createdAt ? parseISO(entry.createdAt) : parseISO(entry.date);
    return format(date, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Reflexiones Pasadas</CardTitle>
        <CardDescription>Una mirada retrospectiva a tu viaje.</CardDescription>
      </CardHeader>
      <CardContent>
         <Accordion type="single" collapsible className="w-full mb-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary"/>
                <span className="text-base font-semibold">Navegador</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex justify-center pt-2">
                <CalendarView
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                    entries={entries}
                />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {entries.length > 0 ? (
          <>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {paginatedEntries.map(entry => (
                  <div key={entry.id} className="p-4 border rounded-lg bg-background/50 group relative">
                    <p className="font-semibold text-sm text-muted-foreground mb-1">
                      {getEntryTimestamp(entry)}
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
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground mx-4">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
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
