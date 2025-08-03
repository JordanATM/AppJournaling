'use client';

import React from 'react';
import { Wind, Search, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import UserMenu from './UserMenu';


interface HeaderProps {
  onSearchChange: (query: string) => void;
  onEditProfile: () => void;
}

export default function Header({ onSearchChange, onEditProfile }: HeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="flex-shrink-0 border-b border-border/80 bg-card/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Wind className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-headline tracking-tight">
              Corriente Serena
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar entradas..."
                className="pl-10 h-9"
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Buscar en las entradas del diario"
              />
            </div>
            <UserMenu onLogout={handleLogout} onEditProfile={onEditProfile}/>
          </div>
        </div>
      </div>
    </header>
  );
}
