'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { format, startOfDay } from 'date-fns';
import type { JournalEntry, Habit, HabitLog } from '@/lib/types';
import Header from '@/components/Header';
import JournalEditor from '@/components/JournalEditor';
import PastEntries from '@/components/PastEntries';
import CalendarView from '@/components/CalendarView';
import HabitTracker from '@/components/HabitTracker';

interface DashboardProps {
  initialEntries: JournalEntry[];
  initialHabits: Habit[];
  initialLogs: HabitLog;
}

export default function Dashboard({ initialEntries, initialHabits, initialLogs }: DashboardProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [habitLogs, setHabitLogs] = useState<HabitLog>(initialLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));

  // Ensure selectedDate is always at the start of the day to avoid timezone issues
  useEffect(() => {
    setSelectedDate(prevDate => startOfDay(prevDate));
  }, []);

  const formattedSelectedDate = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  const handleSaveEntry = (content: string) => {
    setEntries(prevEntries => {
      const existingEntryIndex = prevEntries.findIndex(e => e.date === formattedSelectedDate);
      if (existingEntryIndex > -1) {
        const updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = { ...updatedEntries[existingEntryIndex], content };
        return updatedEntries;
      } else {
        const newEntry: JournalEntry = {
          id: `e${prevEntries.length + 1}`,
          date: formattedSelectedDate,
          content,
        };
        return [...prevEntries, newEntry];
      }
    });
  };
  
  const handleToggleHabit = (habitId: string, date: string) => {
    setHabitLogs(prevLogs => {
      const newLogs = { ...prevLogs };
      const dayLog = newLogs[date] ?? { completedHabits: new Set() };
      const newCompletedHabits = new Set(dayLog.completedHabits);

      if (newCompletedHabits.has(habitId)) {
        newCompletedHabits.delete(habitId);
      } else {
        newCompletedHabits.add(habitId);
      }
      
      newLogs[date] = { completedHabits: newCompletedHabits };
      return newLogs;
    });
  };

  const handleAddHabit = (newHabit: Omit<Habit, 'id'>) => {
    setHabits(prevHabits => {
      const habit: Habit = {
        ...newHabit,
        id: `h${prevHabits.length + 1}`,
      };
      return [...prevHabits, habit];
    });
  }

  const handleDeleteHabit = (habitId: string) => {
    setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
    // Also remove from logs
    setHabitLogs(prevLogs => {
      const newLogs = { ...prevLogs };
      for (const date in newLogs) {
        newLogs[date].completedHabits.delete(habitId);
      }
      return newLogs;
    });
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry =>
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      <Header onSearchChange={setSearchQuery} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-screen-2xl mx-auto">
          
          <div className="lg:col-span-2 xl:col-span-3 space-y-8">
            <JournalEditor
              key={formattedSelectedDate}
              selectedDate={selectedDate}
              entries={entries}
              onSave={handleSaveEntry}
            />
            <PastEntries entries={filteredEntries} />
          </div>

          <div className="lg:col-span-1 xl:col-span-1 space-y-8">
            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              entries={entries}
            />
            <HabitTracker
              habits={habits}
              habitLogs={habitLogs}
              selectedDate={formattedSelectedDate}
              onToggleHabit={handleToggleHabit}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
