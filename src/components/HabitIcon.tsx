'use client';

import React from 'react';
import * as lucideIcons from 'lucide-react';

interface HabitIconProps {
  iconName: string;
  className?: string;
}

const HabitIcon = ({ iconName, className }: HabitIconProps) => {
  const Icon = lucideIcons[iconName as keyof typeof lucideIcons];

  if (!Icon || typeof Icon === 'string') {
    // Fallback for invalid icon names
    return <lucideIcons.HelpCircle className={className} />;
  }

  return <Icon className={className} />;
};

export default HabitIcon;
