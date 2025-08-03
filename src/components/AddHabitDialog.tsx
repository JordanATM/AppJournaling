'use client';

import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Habit } from '@/lib/types';
import HabitIcon from './HabitIcon';

interface AddHabitDialogProps {
  children: React.ReactNode;
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
}

const iconNames = [
  'Smile', 'Heart', 'Star', 'CheckCircle', 'XCircle', 'Book', 'Coffee', 'Cloud', 'Sun', 'Moon',
  'Gift', 'Briefcase', 'Code', 'Film', 'Music', 'Pen', 'Users', 'Zap', 'Leaf', 'Droplets',
  'Footprints', 'Sunrise', 'Bike', 'Dumbbell', 'Apple', 'AlarmClock', 'Anchor'
];

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
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <HabitIcon iconName={icon} className="h-5 w-5" />
                    <SelectValue placeholder="Select an icon" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <div className="grid grid-cols-5 gap-2 p-2 max-h-60 overflow-y-auto">
                    {iconNames.map((iconName) => (
                      <SelectItem key={iconName} value={iconName} className="flex justify-center items-center p-2">
                        <HabitIcon iconName={iconName} className="h-5 w-5" />
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleAdd} disabled={!name || !icon}>
            Add Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
