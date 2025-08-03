'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Music4 } from 'lucide-react';

export default function LofiPlayer() {
  const isMobile = useIsMobile();

  // Durante el renderizado inicial en el servidor, isMobile puede ser undefined.
  // Podemos renderizar un esqueleto o nada hasta que el cliente determine el tamaño de la pantalla.
  if (isMobile === undefined) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-80 overflow-hidden">
        <CardContent className="p-0 relative w-full h-full" />
      </Card>
    );
  }

  if (isMobile) {
    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-80 overflow-hidden flex flex-col justify-center items-center bg-accent/20">
            <CardContent className="text-center p-6">
                <Music4 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Música Relajante</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    El reproductor de música está disponible en la versión de escritorio para una mejor experiencia.
                </p>
            </CardContent>
        </Card>
    );
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
