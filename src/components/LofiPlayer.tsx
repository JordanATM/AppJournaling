'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function LofiPlayer() {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-80 overflow-hidden">
      <CardContent className="p-0 relative w-full h-full">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/MYPVQccHhAQ?autoplay=1&mute=1&loop=1&playlist=MYPVQccHhAQ&controls=0&showinfo=0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </CardContent>
    </Card>
  );
}
