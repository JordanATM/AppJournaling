import Dashboard from '@/components/Dashboard';
import { DUMMY_ENTRIES, DUMMY_HABITS, DUMMY_LOGS } from '@/lib/data';

export default function Home() {
  // In a real app, this data would be fetched from a database.
  const entries = DUMMY_ENTRIES;
  const habits = DUMMY_HABITS;
  const logs = DUMMY_LOGS;

  return <Dashboard initialEntries={entries} initialHabits={habits} initialLogs={logs} />;
}
