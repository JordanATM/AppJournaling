
'use client';

import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import type { JournalEntry } from '@/lib/types';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { parse } from 'date-fns';

interface CalendarViewProps {
  today: Date;
  onDateClick: (date: Date) => void;
  entries: JournalEntry[];
  className?: string;
}

export default function CalendarView({ today, onDateClick, entries, className }: CalendarViewProps) {
  const entryDates = entries.map(e => {
    // Analiza la cadena de fecha 'yyyy-MM-dd' en la zona horaria local.
    // Esto evita problemas de desplazamiento de zona horaria que ocurren con new Date().
    return parse(e.date, 'yyyy-MM-dd', new Date());
  });

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
          font-weight: bold;
          border: 1px solid hsl(var(--primary));
        }
        .rdp-day:not(.rdp-day_selected):not(.rdp-day_outside):hover {
            background-color: hsl(var(--accent) / 0.1);
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
        selected={today}
        onDayClick={(date) => date && onDateClick(date)}
        modifiers={{
          'day-with-entry': entryDates,
        }}
        modifiersClassNames={{
          selected: 'rdp-day_selected',
          'day-with-entry': 'day-with-entry',
        }}
        showOutsideDays
      />
    </div>
  );
}
