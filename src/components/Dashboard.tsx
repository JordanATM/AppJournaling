'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { format, parseISO, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import type { JournalEntry, Habit, HabitLog } from '@/lib/types';
import Header from '@/components/Header';
import JournalEditor from '@/components/JournalEditor';
import PastEntries from '@/components/PastEntries';
import CalendarView from '@/components/CalendarView';
import HabitTracker from '@/components/HabitTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);


  // This effect runs once on the client after initial hydration
  // to prevent server/client mismatch for the date.
  useEffect(() => {
    setSelectedDate(startOfDay(new Date()));
  }, []);

  const formattedSelectedDate = useMemo(
    () => (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''),
    [selectedDate]
  );

  const handleSaveEntry = (content: string, date: string) => {
    setEntries(prevEntries => {
      const existingEntryIndex = prevEntries.findIndex(e => e.date === date);
      if (existingEntryIndex > -1) {
        const updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = { ...updatedEntries[existingEntryIndex], content };
        return updatedEntries;
      } else {
        const newEntry: JournalEntry = {
          id: `e${Date.now()}`,
          date: date,
          content,
        };
        return [...prevEntries, newEntry];
      }
    });
  };
  
  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedDate(parseISO(entry.date));
  };
  
  const handleDeleteEntry = (entryId: string) => {
    setEntryToDelete(entryId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteEntry = () => {
    if (entryToDelete) {
      setEntries(prevEntries => prevEntries.filter(e => e.id !== entryToDelete));
    }
    setEntryToDelete(null);
    setIsDeleteDialogOpen(false);
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
        id: `h${Date.now()}`,
      };
      return [...prevHabits, habit];
    });
  }

  const handleEditHabit = (updatedHabit: Habit) => {
    setHabits(prevHabits =>
      prevHabits.map(h => (h.id === updatedHabit.id ? updatedHabit : h))
    );
  };

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
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, searchQuery]);

  if (!selectedDate) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground font-body">
        <Header onSearchChange={setSearchQuery} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-screen-2xl mx-auto">
            <div className="lg:col-span-2 xl:col-span-3 space-y-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-72 w-full" />
                </CardContent>
              </Card>
              <PastEntries entries={[]} onEdit={() => {}} onDelete={() => {}} />
            </div>
            <div className="lg:col-span-1 xl:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="flex justify-center">
                   <Skeleton className="h-64 w-64" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-background text-foreground font-body">
        <Header onSearchChange={setSearchQuery} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-screen-2xl mx-auto">
            
            <div className="lg:col-span-2 xl:col-span-3 space-y-8">
              <JournalEditor
                key={formattedSelectedDate}
                selectedDate={selectedDate}
                entries={entries}
                onSave={(content) => handleSaveEntry(content, formattedSelectedDate)}
              />
              <PastEntries 
                entries={filteredEntries} 
                onEdit={handleEditEntry} 
                onDelete={handleDeleteEntry}
              />
            </div>

            <div className="lg:col-span-1 xl:col-span-1 space-y-8">
              <CalendarView
                selectedDate={selectedDate}
                onDateSelect={d => setSelectedDate(startOfDay(d))}
                entries={entries}
              />
              <HabitTracker
                habits={habits}
                habitLogs={habitLogs}
                selectedDate={formattedSelectedDate}
                onToggleHabit={handleToggleHabit}
                onAddHabit={handleAddHabit}
                onEditHabit={handleEditHabit}
                onDeleteHabit={handleDeleteHabit}
              />
            </div>
          </div>
        </main>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente tu entrada del diario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEntry}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
