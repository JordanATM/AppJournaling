
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
        .rdp {
          width: 100%;
          --rdp-cell-size: 100%;
          --rdp-caption-font-size: 1.125rem;
          --rdp-caption-font-weight: 600;
          --rdp-accent-color: hsl(var(--accent));
          --rdp-background-color: transparent;
          --rdp-foreground-color: hsl(var(--foreground));
          --rdp-border: 1px solid hsl(var(--border));
          --rdp-selected-color: hsl(var(--primary-foreground));
          --rdp-selected-background-color: hsl(var(--primary));
          --rdp-today-color: hsl(var(--primary));
          --rdp-today-font-weight: bold;
        }
        .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
          background-color: var(--rdp-selected-background-color) !important;
          color: var(--rdp-selected-color) !important;
          font-weight: 500;
        }
        .rdp-day_today:not(.rdp-day_selected) {
          color: var(--rdp-today-color);
          font-weight: var(--rdp-today-font-weight);
          background-color: hsl(var(--accent) / 0.2);
        }
        .day-with-entry {
          position: relative;
        }
        .day-with-entry::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: var(--rdp-accent-color);
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
        className="p-3"
        showOutsideDays
      />
    </div>
  );
}
