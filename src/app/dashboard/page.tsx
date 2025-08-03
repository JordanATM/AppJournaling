'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Dashboard from '@/components/Dashboard';
import { DUMMY_ENTRIES, DUMMY_HABITS, DUMMY_LOGS } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground font-body">
         <header className="flex-shrink-0 border-b border-border/80 bg-card/50 backdrop-blur-lg">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-7 w-7" />
                        <Skeleton className="h-7 w-48" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-9 w-40" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </div>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-screen-2xl mx-auto">
            <div className="lg:col-span-2 xl:col-span-3 space-y-8">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
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
  
  // In a real app, this data would be fetched from a database for the logged-in user.
  const entries = DUMMY_ENTRIES;
  const habits = DUMMY_HABITS;
  const logs = DUMMY_LOGS;

  return <Dashboard initialEntries={entries} initialHabits={habits} initialLogs={logs} />;
}
