
'use client';

import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import type { JournalEntry } from '@/lib/types';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  entries: JournalEntry[];
  className?: string;
}

export default function CalendarView({ selectedDate, onDateSelect, entries, className }: CalendarViewProps) {
  const entryDates = entries.map(e => new Date(e.date));

  return (
    <div className={cn("flex justify-center items-center h-full", className)}>
      <style>{`
        .rdp {
          --rdp-cell-size: 2.5rem;
          margin: 1rem 0;
        }
        .rdp-caption_label {
          font-size: 1.125rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        .rdp-nav_button {
          color: hsl(var(--foreground));
        }
        .rdp-head_cell {
          color: hsl(var(--muted-foreground));
          font-weight: 500;
        }
        .rdp-day {
          color: hsl(var(--foreground));
        }
        .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          font-weight: 500;
        }
        .rdp-day_today:not(.rdp-day_selected) {
          color: hsl(var(--primary));
          font-weight: bold;
          background-color: hsl(var(--accent) / 0.2);
        }
        .day-with-entry:not(.rdp-day_selected) {
          position: relative;
        }
        .day-with-entry:not(.rdp-day_selected)::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: hsl(var(--accent));
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
        showOutsideDays
      />
    </div>
  );
}
