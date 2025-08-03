'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import HabitIcon from './HabitIcon';

interface IconPickerProps {
  iconNames: string[];
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

export default function IconPicker({ iconNames, selectedIcon, onIconSelect }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start font-normal">
          <HabitIcon iconName={selectedIcon} className="mr-2 h-4 w-4" />
          {selectedIcon}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <ScrollArea className="h-72">
          <div className="grid grid-cols-6 gap-1 p-2">
            {iconNames.map((name) => (
              <Button
                key={name}
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => {
                  onIconSelect(name);
                  setOpen(false);
                }}
              >
                <HabitIcon iconName={name} className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
