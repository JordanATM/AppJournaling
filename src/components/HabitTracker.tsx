'use client';

import React, { useMemo, useState } from 'react';
import type { Habit, HabitLog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartConfig, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { addDays, format, startOfWeek, getWeek } from 'date-fns';
import { Plus, Trash2, Pencil } from 'lucide-react';
import HabitIcon from './HabitIcon';
import AddHabitDialog from './AddHabitDialog';

interface HabitTrackerProps {
  habits: Habit[];
  habitLogs: HabitLog;
  selectedDate: string;
  onToggleHabit: (habitId: string, date: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

export default function HabitTracker({ habits, habitLogs, selectedDate, onToggleHabit, onAddHabit, onEditHabit, onDeleteHabit }: HabitTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  const { chartData, weekNumber } = useMemo(() => {
    const data = [];
    const today = selectedDate ? new Date(selectedDate) : new Date();
    const weekNumber = getWeek(today);
    // Use startOfWeek to get the beginning of the week (Sunday by default, { weekStartsOn: 1 } for Monday)
    const start = startOfWeek(today, { weekStartsOn: 1 }); 
    for (let i = 0; i < 7; i++) {
      const date = addDays(start, i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayLog = habitLogs[dateString];
      data.push({
        date: format(date, 'EEE'), // Format to 'Mon', 'Tue', etc.
        completed: dayLog ? dayLog.completedHabits.size : 0,
      });
    }
    return { chartData: data, weekNumber };
  }, [habitLogs, selectedDate]);

  const chartConfig = {
    completed: {
      label: "Habits Completed",
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


  return (
    <>
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Habit Tracker</CardTitle>
          <CardDescription>Your daily progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Today's Habits</h3>
            <div className="space-y-3">
              {habits.map(habit => (
                <div key={habit.id} className="flex items-center space-x-3 p-2 rounded-md transition-colors group hover:bg-accent/50">
                  <Checkbox
                    id={`habit-${habit.id}`}
                    checked={completedToday.has(habit.id)}
                    onCheckedChange={() => onToggleHabit(habit.id, selectedDate)}
                    aria-label={`Mark habit ${habit.name} as complete`}
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
                      aria-label={`Edit habit ${habit.name}`}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      onClick={() => onDeleteHabit(habit.id)}
                      aria-label={`Delete habit ${habit.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-2 w-full" onClick={handleOpenAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Habit
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Weekly Streak - Week {weekNumber}</h3>
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
