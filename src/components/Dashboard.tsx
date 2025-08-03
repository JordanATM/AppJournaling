'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { format, parseISO, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import type { JournalEntry, Habit, HabitLog } from '@/lib/types';
import Header from '@/components/Header';
import JournalEditor from '@/components/JournalEditor';
import PastEntries from '@/components/PastEntries';
import CalendarView from '@/components/CalendarView';
import HabitTracker from '@/components/HabitTracker';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { useAuth } from '@/hooks/use-auth';
import * as firestore from '@/lib/firestore';
import { DUMMY_ENTRIES, DUMMY_HABITS, DUMMY_LOGS } from '@/lib/data';


export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const fetchData = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const [userEntries, userHabits, userHabitLogs] = await Promise.all([
        firestore.getJournalEntries(userId),
        firestore.getHabits(userId),
        firestore.getHabitLogs(userId),
      ]);

      // Check if user has data, if not, seed with dummy data
      if (userEntries.length === 0 && userHabits.length === 0) {
        await firestore.seedInitialData(userId, DUMMY_ENTRIES, DUMMY_HABITS, DUMMY_LOGS);
        const [seededEntries, seededHabits, seededLogs] = await Promise.all([
            firestore.getJournalEntries(userId),
            firestore.getHabits(userId),
            firestore.getHabitLogs(userId),
        ]);
        setEntries(seededEntries);
        setHabits(seededHabits);
        setHabitLogs(seededLogs);
      } else {
        setEntries(userEntries);
        setHabits(userHabits);
        setHabitLogs(userHabitLogs);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData(user.uid);
    }
  }, [user, fetchData]);

  useEffect(() => {
    setSelectedDate(startOfDay(new Date()));
  }, []);

  const formattedSelectedDate = useMemo(
    () => (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''),
    [selectedDate]
  );

  const handleSaveEntry = async (content: string, date: string) => {
    if (!user) return;
    
    const existingEntry = entries.find(e => e.date === date);
    const entryData: Omit<JournalEntry, 'id'> & { id?: string } = {
        date,
        content,
    };
    if (existingEntry) {
        entryData.id = existingEntry.id;
    }

    const savedEntry = await firestore.saveJournalEntry(user.uid, entryData);

    setEntries(prevEntries => {
      const existingEntryIndex = prevEntries.findIndex(e => e.id === savedEntry.id);
      if (existingEntryIndex > -1) {
        const updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = savedEntry;
        return updatedEntries;
      } else {
        return [...prevEntries, savedEntry];
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

  const confirmDeleteEntry = async () => {
    if (entryToDelete && user) {
      await firestore.deleteJournalEntry(user.uid, entryToDelete);
      setEntries(prevEntries => prevEntries.filter(e => e.id !== entryToDelete));
    }
    setEntryToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleToggleHabit = async (habitId: string, date: string) => {
    if (!user) return;
    
    const updatedLogs = await firestore.toggleHabitLog(user.uid, habitId, date);
    setHabitLogs(updatedLogs);
  };

  const handleAddHabit = async (newHabit: Omit<Habit, 'id'>) => {
    if (!user) return;
    const addedHabit = await firestore.addHabit(user.uid, newHabit);
    setHabits(prevHabits => [...prevHabits, addedHabit]);
  }

  const handleEditHabit = async (updatedHabit: Habit) => {
    if (!user) return;
    const savedHabit = await firestore.updateHabit(user.uid, updatedHabit);
    setHabits(prevHabits =>
      prevHabits.map(h => (h.id === savedHabit.id ? savedHabit : h))
    );
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!user) return;
    await firestore.deleteHabit(user.uid, habitId);
    setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
    // Firestore triggers would be a better way to handle this, but for now we'll clean up logs on client
    // This part is complex to handle efficiently on client, Firestore rules/functions are better
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry =>
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, searchQuery]);

  if (loading || !selectedDate) {
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
               <Skeleton className="h-80 w-full" />
               <Skeleton className="h-96 w-full" />
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
