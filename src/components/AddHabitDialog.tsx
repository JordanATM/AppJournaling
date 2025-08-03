'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (habit: Omit<Habit, 'id'> | Habit) => void;
  habitToEdit?: Habit | null;
}

const iconNames = [
  'Smile', 'Heart', 'Star', 'CheckCircle', 'XCircle', 'Book', 'Coffee', 'Cloud', 'Sun', 'Moon',
  'Gift', 'Briefcase', 'Code', 'Film', 'Music', 'Pen', 'Users', 'Zap', 'Leaf', 'Droplets',
  'Footprints', 'Sunrise', 'Bike', 'Dumbbell', 'Apple', 'AlarmClock', 'Anchor'
];

export default function AddHabitDialog({ open, onOpenChange, onConfirm, habitToEdit }: AddHabitDialogProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Smile');

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setIcon(habitToEdit.icon);
    } else {
      setName('');
      setIcon('Smile');
    }
  }, [habitToEdit, open]);

  const handleConfirm = () => {
    if (name && icon) {
      if (habitToEdit) {
        onConfirm({ ...habitToEdit, name, icon });
      } else {
        onConfirm({ name, icon });
      }
      onOpenChange(false);
    }
  };

  const isEditing = !!habitToEdit;
  const title = isEditing ? 'Editar Hábito' : 'Añadir un Nuevo Hábito';
  const description = isEditing ? 'Actualiza los detalles de tu hábito.' : 'Crea un nuevo hábito para seguir. Elige un nombre y un icono.';
  const buttonText = isEditing ? 'Guardar Cambios' : 'Añadir Hábito';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Ej: Meditar por 10 minutos"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icono
            </Label>
            <div className="col-span-3">
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue asChild>
                     <div className="flex items-center gap-2">
                        <HabitIcon iconName={icon} className="h-5 w-5" />
                        <span>{icon}</span>
                      </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <div className="grid grid-cols-5 gap-2 p-2 max-h-60 overflow-y-auto">
                    {iconNames.map((iconName) => (
                      <SelectItem key={iconName} value={iconName} className="flex justify-center items-center p-2">
                         <div className="flex items-center gap-2">
                            <HabitIcon iconName={iconName} className="h-5 w-5" />
                         </div>
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleConfirm} disabled={!name || !icon}>
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
