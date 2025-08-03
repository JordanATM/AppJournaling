'use client';

import React, { useState } from 'react';
import * as lucideIcons from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Habit } from '@/lib/types';
import IconPicker from './IconPicker';

interface AddHabitDialogProps {
  children: React.ReactNode;
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
}

const iconNames = Object.keys(lucideIcons).filter(
  (key) => {
    if (key === 'createLucideIcon' || key === 'icons' || key === 'LucideIcon') {
      return false;
    }
    const value = lucideIcons[key as keyof typeof lucideIcons];
    return typeof value === 'object' && value !== null && 'displayName' in value;
  }
);


export default function AddHabitDialog({ children, onAddHabit }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Smile');

  const handleAdd = () => {
    if (name && icon) {
      onAddHabit({ name, icon });
      setName('');
      setIcon('Smile');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Habit</DialogTitle>
          <DialogDescription>
            Create a new habit to track. Choose a name and an icon.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Meditate for 10 minutes"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <div className="col-span-3">
              <IconPicker 
                iconNames={iconNames}
                selectedIcon={icon} 
                onIconSelect={setIcon} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleAdd} disabled={!name}>
            Add Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
