'use client';

import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { JournalEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface CalendarViewProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  entries: JournalEntry[];
}

export default function CalendarView({ selectedDate, onDateSelect, entries }: CalendarViewProps) {
  const entryDates = entries.map(e => new Date(e.date));

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Navigator</CardTitle>
        <CardDescription>Select a day to view</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <style>{`
          .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
            background-color: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
          }
          .rdp-day_today {
            color: hsl(var(--primary));
            font-weight: bold;
          }
          .day-with-entry {
            font-weight: bold;
            text-decoration: underline;
            text-decoration-color: hsl(var(--accent));
            text-decoration-thickness: 2px;
            text-underline-offset: 2px;
          }
        `}</style>
        <DayPicker
          mode="single"
          selected={selectedDate || undefined}
          onSelect={(date) => date && onDateSelect(date)}
          modifiers={{
            'day-with-entry': entryDates,
          }}
          modifiersClassNames={{
            selected: 'rdp-day_selected',
            today: 'rdp-day_today',
            'day-with-entry': 'day-with-entry',
          }}
          className="p-0"
        />
      </CardContent>
    </Card>
  );
}
