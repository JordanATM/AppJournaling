import type { JournalEntry, Habit, HabitLog } from '@/lib/types';
import { subDays, format } from 'date-fns';

export const DUMMY_HABITS: Habit[] = [
  { id: 'h1', name: 'Read for 15 minutes', icon: 'BookText' },
  { id: 'h2', name: 'Mindful moment', icon: 'Leaf' },
  { id: 'h3', name: 'Drink 8 glasses of water', icon: 'Droplets' },
  { id: 'h4', name: 'Go for a walk', icon: 'Footprints' },
  { id: 'h5', name: 'Morning stretch', icon: 'Sunrise' },
];

const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

export const DUMMY_ENTRIES: JournalEntry[] = [
  {
    id: 'e1',
    date: formatDate(today),
    content: "Today was a peaceful day. I spent some time in the garden, feeling the sun on my face. It's the small moments that bring the most joy. I also managed to finish a chapter of my book, which felt like a good accomplishment."
  },
  {
    id: 'e2',
    date: formatDate(subDays(today, 1)),
    content: "Felt a bit restless yesterday. The weather was gloomy, which might have contributed. I tried a new recipe for dinner, and it turned out surprisingly well. Cooking helps to ground me when my thoughts are scattered."
  },
  {
    id: 'e3',
    date: formatDate(subDays(today, 3)),
    content: "A productive day at work. I had a breakthrough on a project that's been bugging me for a while. It's a reminder that persistence pays off. In the evening, I went for a long walk to clear my head."
  },
    {
    id: 'e4',
    date: formatDate(subDays(today, 5)),
    content: "Had a wonderful chat with an old friend. It's amazing how some connections feel timeless. We reminisced about our college days and laughed until our sides hurt. It was a much-needed dose of nostalgia and warmth."
  },
];

export const DUMMY_LOGS: HabitLog = {
  [formatDate(today)]: { completedHabits: new Set(['h1', 'h3']) },
  [formatDate(subDays(today, 1))]: { completedHabits: new Set(['h2', 'h3', 'h4']) },
  [formatDate(subDays(today, 2))]: { completedHabits: new Set(['h1', 'h2', 'h3', 'h4', 'h5']) },
  [formatDate(subDays(today, 3))]: { completedHabits: new Set(['h1', 'h4', 'h5']) },
  [formatDate(subDays(today, 4))]: { completedHabits: new Set(['h3']) },
  [formatDate(subDays(today, 5))]: { completedHabits: new Set(['h1', 'h2', 'h3']) },
  [formatDate(subDays(today, 6))]: { completedHabits: new Set(['h1', 'h3', 'h5']) },
  [formatDate(subDays(today, 7))]: { completedHabits: new Set(['h2', 'h4']) },
};
