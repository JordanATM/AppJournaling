'use client';

import React from 'react';
import { Wind, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onSearchChange: (query: string) => void;
}

export default function Header({ onSearchChange }: HeaderProps) {
  return (
    <header className="flex-shrink-0 border-b border-border/80 bg-card/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Wind className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-headline tracking-tight">
              Serene Stream
            </h1>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search entries..."
              className="pl-10 h-9"
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search journal entries"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
