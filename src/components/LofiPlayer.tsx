'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Music4 } from 'lucide-react';

export default function LofiPlayer() {
  const isMobile = useIsMobile();

  // Durante el renderizado inicial en el servidor, isMobile puede ser undefined.
  // Renderizamos null para evitar que se muestre algo hasta que se determine en el cliente.
  if (isMobile === undefined || isMobile) {
    return null;
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-80 overflow-hidden">
      <CardContent className="p-0 relative w-full h-full">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/MYPVQccHhAQ?loop=1&playlist=MYPVQccHhAQ&controls=0&showinfo=0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </CardContent>
    </Card>
  );
}
