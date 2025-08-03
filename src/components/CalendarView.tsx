'use client';

import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import type { JournalEntry } from '@/lib/types';
import { es } from 'date-fns/locale';

interface CalendarViewProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  entries: JournalEntry[];
  className?: string;
}

export default function CalendarView({ selectedDate, onDateSelect, entries, className }: CalendarViewProps) {
  const entryDates = entries.map(e => new Date(e.date));

  return (
    <div className={className}>
      <style>{`
        .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }
        .rdp-day_today:not(.rdp-day_selected) {
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
        locale={es}
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
    </div>
  );
}
