'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="space-y-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-8 w-64" />
        <div className="flex justify-center pt-4">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
