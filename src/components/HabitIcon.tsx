'use client';

import React from 'react';
import * as lucideIcons from 'lucide-react';

interface HabitIconProps {
  iconName: string;
  className?: string;
}

const HabitIcon = ({ iconName, className }: HabitIconProps) => {
  const Icon = lucideIcons[iconName as keyof typeof lucideIcons];

  if (!Icon || typeof Icon === 'string' || typeof Icon !== 'object') {
    // Fallback for invalid icon names, ensures we don't try to render non-components
    return <lucideIcons.HelpCircle className={className} />;
  }

  return <Icon className={className} />;
};

export default HabitIcon;
