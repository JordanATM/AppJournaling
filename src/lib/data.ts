import type { JournalEntry, Habit, HabitLog } from '@/lib/types';
import { subDays, format } from 'date-fns';

export const DUMMY_HABITS: Habit[] = [
  { id: 'h1', name: 'Leer durante 15 minutos', icon: 'Book' },
  { id: 'h2', name: 'Momento de atención plena', icon: 'Leaf' },
  { id: 'h3', name: 'Beber 8 vasos de agua', icon: 'Droplets' },
  { id: 'h4', name: 'Salir a caminar', icon: 'Footprints' },
  { id: 'h5', name: 'Estiramiento matutino', icon: 'Sunrise' },
];

const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
const formatISO = (date: Date) => date.toISOString();

export const DUMMY_ENTRIES: JournalEntry[] = [
  {
    id: 'e1',
    date: formatDate(today),
    createdAt: formatISO(subDays(today, 0)),
    content: "Hoy fue un día tranquilo. Pasé un tiempo en el jardín, sintiendo el sol en mi cara. Son los pequeños momentos los que traen la mayor alegría. También logré terminar un capítulo de mi libro, lo que se sintió como un buen logro."
  },
  {
    id: 'e2',
    date: formatDate(subDays(today, 1)),
    createdAt: formatISO(subDays(today, 1)),
    content: "Ayer me sentí un poco inquieto. El clima estaba sombrío, lo que podría haber contribuido. Probé una nueva receta para la cena y salió sorprendentemente bien. Cocinar me ayuda a centrarme cuando mis pensamientos están dispersos."
  },
  {
    id: 'e3',
    date: formatDate(subDays(today, 3)),
    createdAt: formatISO(subDays(today, 3)),
    content: "Un día productivo en el trabajo. Tuve un avance en un proyecto que me ha estado molestando por un tiempo. Es un recordatorio de que la persistencia vale la pena. Por la noche, salí a dar un largo paseo para despejar mi mente."
  },
    {
    id: 'e4',
    date: formatDate(subDays(today, 5)),
    createdAt: formatISO(subDays(today, 5)),
    content: "Tuve una charla maravillosa con un viejo amigo. Es increíble cómo algunas conexiones se sienten atemporales. Recordamos nuestros días de universidad y nos reímos hasta que nos dolieron los costados. Fue una dosis muy necesaria de nostalgia y calidez."
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
