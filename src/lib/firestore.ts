import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  getDoc,
  runTransaction,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { JournalEntry, Habit, HabitLog } from './types';

// Collections
const getUsersCollection = () => collection(db, 'users');
const getEntriesCollection = (userId: string) => collection(getUsersCollection(), userId, 'entries');
const getHabitsCollection = (userId: string) => collection(getUsersCollection(), userId, 'habits');
const getHabitLogsCollection = (userId: string) => collection(getUsersCollection(), userId, 'habitLogs');

// Journal Entries
export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const entriesCol = getEntriesCollection(userId);
  const snapshot = await getDocs(entriesCol);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as JournalEntry));
}

export async function saveJournalEntry(
  userId: string,
  entry: Omit<JournalEntry, 'id'> & { id?: string }
): Promise<JournalEntry> {
  const entriesCol = getEntriesCollection(userId);
  
  if (entry.id) {
    // Editing an existing entry
    const entryRef = doc(entriesCol, entry.id);
    const { id, ...dataToUpdate } = entry;
    await updateDoc(entryRef, dataToUpdate);
    return entry as JournalEntry;
  } else {
    // Creating a new entry
    const newEntryData = {
      ...entry,
      createdAt: entry.createdAt || new Date().toISOString(),
    };
    const { id, ...dataToSave } = newEntryData;
    const entryRef = await addDoc(entriesCol, dataToSave);
    return { id: entryRef.id, ...dataToSave } as JournalEntry;
  }
}

export async function deleteJournalEntry(userId: string, entryId: string): Promise<void> {
  const entryRef = doc(getEntriesCollection(userId), entryId);
  await deleteDoc(entryRef);
}

// Habits
export async function getHabits(userId: string): Promise<Habit[]> {
  const habitsCol = getHabitsCollection(userId);
  const snapshot = await getDocs(habitsCol);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Habit));
}

export async function addHabit(userId: string, habit: Omit<Habit, 'id'>): Promise<Habit> {
    const habitsCol = getHabitsCollection(userId);
    const docRef = await addDoc(habitsCol, habit);
    return { id: docRef.id, ...habit };
}

export async function updateHabit(userId: string, habit: Habit): Promise<Habit> {
  const habitRef = doc(getHabitsCollection(userId), habit.id);
  const { id, ...dataToUpdate } = habit;
  await setDoc(habitRef, dataToUpdate, { merge: true });
  return habit;
}

export async function deleteHabit(userId: string, habitId: string): Promise<void> {
  const habitRef = doc(getHabitsCollection(userId), habitId);
  await deleteDoc(habitRef);
  // Note: Deleting a habit does not automatically clean up its entries in habitLogs.
  // This would be best handled by a Cloud Function trigger on delete.
}

// Habit Logs
export async function getHabitLogs(userId: string): Promise<HabitLog> {
    const logsCol = getHabitLogsCollection(userId);
    const snapshot = await getDocs(logsCol);
    const logs: HabitLog = {};
    snapshot.forEach(doc => {
        const data = doc.data();
        logs[doc.id] = { completedHabits: new Set(data.completedHabits || []) };
    });
    return logs;
}


export async function toggleHabitLog(userId: string, habitId: string, date: string): Promise<HabitLog> {
  const logRef = doc(getHabitLogsCollection(userId), date);
  
  await runTransaction(db, async (transaction) => {
    const logDoc = await transaction.get(logRef);
    if (!logDoc.exists()) {
      transaction.set(logRef, { completedHabits: [habitId] });
    } else {
      const data = logDoc.data();
      const completedHabits = new Set<string>(data.completedHabits || []);
      if (completedHabits.has(habitId)) {
        completedHabits.delete(habitId);
      } else {
        completedHabits.add(habitId);
      }
      transaction.update(logRef, { completedHabits: Array.from(completedHabits) });
    }
  });

  return getHabitLogs(userId); // Re-fetch all logs to return the updated state
}


// Seed initial data for new users
export async function seedInitialData(
  userId: string,
  entries: JournalEntry[],
  habits: Habit[],
  logs: HabitLog
): Promise<void> {
  const batch = writeBatch(db);

  const entriesCol = getEntriesCollection(userId);
  entries.forEach(entry => {
    const { id, ...data } = entry;
    batch.set(doc(entriesCol, id), data);
  });

  const habitsCol = getHabitsCollection(userId);
  habits.forEach(habit => {
    const { id, ...data } = habit;
    batch.set(doc(habitsCol, id), data);
  });

  const logsCol = getHabitLogsCollection(userId);
  Object.keys(logs).forEach(date => {
    const logData = { completedHabits: Array.from(logs[date].completedHabits) };
    batch.set(doc(logsCol, date), logData);
  });
  
  await batch.commit();
}
