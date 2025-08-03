'use client';

import React, { useMemo } from 'react';
import type { Habit, HabitLog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ChartContainer, ChartConfig, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { subDays, format } from 'date-fns';
import HabitIcon from './HabitIcon';

interface HabitTrackerProps {
  habits: Habit[];
  habitLogs: HabitLog;
  selectedDate: string;
  onToggleHabit: (habitId: string, date: string) => void;
}

export default function HabitTracker({ habits, habitLogs, selectedDate, onToggleHabit }: HabitTrackerProps) {

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(selectedDate), i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayLog = habitLogs[dateString];
      data.push({
        date: format(date, 'MMM d'),
        completed: dayLog ? dayLog.completedHabits.size : 0,
      });
    }
    return data;
  }, [habitLogs, selectedDate]);

  const chartConfig = {
    completed: {
      label: "Habits Completed",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;
  
  const completedToday = habitLogs[selectedDate]?.completedHabits ?? new Set();

  return (
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
              <div key={habit.id} className="flex items-center space-x-3 p-2 rounded-md transition-colors hover:bg-accent/50">
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
              </div>
            ))}
          </div>
        </div>
        <div>
           <h3 className="text-lg font-semibold mb-2">Weekly Streak</h3>
          <ChartContainer config={chartConfig} className="h-[150px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
                domain={[0, habits.length]}
              />
              <Tooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
