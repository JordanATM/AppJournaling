'use client';

import React, { useMemo, useState, useEffect } from 'react';
import type { Habit, HabitLog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartConfig, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { addDays, subDays, format, startOfWeek, getWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import HabitIcon from './HabitIcon';
import AddHabitDialog from './AddHabitDialog';

interface HabitTrackerProps {
  habits: Habit[];
  habitLogs: HabitLog;
  selectedDate: string;
  onToggleHabit: (habitId: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

export default function HabitTracker({ habits, habitLogs, selectedDate, onToggleHabit, onAddHabit, onEditHabit, onDeleteHabit }: HabitTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [displayDate, setDisplayDate] = useState(new Date(selectedDate));

  useEffect(() => {
    setDisplayDate(new Date(selectedDate));
  }, [selectedDate]);

  const { chartData, weekNumber } = useMemo(() => {
    const data = [];
    const weekNumber = getWeek(displayDate, { locale: es });
    const start = startOfWeek(displayDate, { weekStartsOn: 1, locale: es });
    for (let i = 0; i < 7; i++) {
      const date = addDays(start, i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayLog = habitLogs[dateString];
      data.push({
        date: format(date, 'EEE d', { locale: es }),
        completed: dayLog ? dayLog.completedHabits.size : 0,
      });
    }
    return { chartData: data, weekNumber };
  }, [habitLogs, displayDate]);

  const chartConfig = {
    completed: {
      label: "Hábitos Completados",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  const completedToday = habitLogs[selectedDate]?.completedHabits ?? new Set();

  const handleOpenAddDialog = () => {
    setHabitToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (habit: Habit) => {
    setHabitToEdit(habit);
    setIsDialogOpen(true);
  };

  const handleConfirmDialog = (habit: Omit<Habit, 'id'> | Habit) => {
    if ('id' in habit) {
      onEditHabit(habit as Habit);
    } else {
      onAddHabit(habit);
    }
  };

  const handlePrevWeek = () => {
    setDisplayDate(subDays(displayDate, 7));
  };

  const handleNextWeek = () => {
    setDisplayDate(addDays(displayDate, 7));
  };


  return (
    <>
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Seguimiento de Hábitos</CardTitle>
          <CardDescription>Tu progreso para hoy, {format(new Date(selectedDate), "d 'de' MMMM", {locale: es})}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Hábitos de Hoy</h3>
            <div className="space-y-3">
              {habits.map(habit => (
                <div key={habit.id} className="flex items-center space-x-3 p-2 rounded-md transition-colors group hover:bg-accent/50">
                  <Checkbox
                    id={`habit-${habit.id}`}
                    checked={completedToday.has(habit.id)}
                    onCheckedChange={() => onToggleHabit(habit.id)}
                    aria-label={`Marcar hábito ${habit.name} como completado`}
                  />
                  <label
                    htmlFor={`habit-${habit.id}`}
                    className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {habit.name}
                  </label>
                  <HabitIcon iconName={habit.icon} className="h-5 w-5 text-primary" />
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      onClick={() => handleOpenEditDialog(habit)}
                      aria-label={`Editar hábito ${habit.name}`}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      onClick={() => onDeleteHabit(habit.id)}
                      aria-label={`Eliminar hábito ${habit.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-2 w-full" onClick={handleOpenAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Hábito
            </Button>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Racha Semanal - Semana {weekNumber}</h3>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrevWeek}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Semana anterior</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextWeek}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Semana siguiente</span>
                    </Button>
                </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[150px] w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                  domain={[0, Math.max(1, habits.length)]}
                />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      <AddHabitDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirmDialog}
        habitToEdit={habitToEdit}
      />
    </>
  );
}
