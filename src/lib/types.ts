import type { LucideIcon } from 'lucide-react';

export type JournalEntry = {
  id: string;
  date: string; // YYYY-MM-DD format
  content: string;
  createdAt?: string; // ISO 8601 format
};

export type Habit = {
  id: string;
  name: string;
  icon: string; // Changed from LucideIcon to string
};

export type HabitLog = {
  [date: string]: { // YYYY-MM-DD format
    completedHabits: Set<string>; // Set of habit IDs
  }
};
