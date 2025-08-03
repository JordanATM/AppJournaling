'use client';

import React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, Play, Pause } from 'lucide-react';

const images = Array.from({ length: 5 }).map((_, i) => ({
  src: `https://picsum.photos/800/400?random=${i}`,
  alt: 'A random cozy lofi-style image',
  hint: 'cozy lofi'
}));

export default function LofiPlayer() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => console.error("Audio playback failed:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const setVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = parseFloat(e.target.value);
    }
  };
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-full overflow-hidden">
      <CardContent className="p-0 relative">
        <Carousel className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-80">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={image.hint}
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-sm px-8">
             <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl flex items-center gap-4 text-white">
                <button onClick={togglePlayPause} className="text-white hover:text-primary-foreground transition-colors">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <div className="flex items-center gap-2 flex-1">
                    <Volume2 size={20} />
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        defaultValue="0.5"
                        onChange={setVolume}
                        className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer range-sm"
                        aria-label="Volume"
                    />
                </div>
                <CarouselPrevious className="relative -left-2 top-auto translate-y-0 h-8 w-8 text-white bg-white/20 hover:bg-white/30 border-0" />
                <CarouselNext className="relative -right-2 top-auto translate-y-0 h-8 w-8 text-white bg-white/20 hover:bg-white/30 border-0" />
             </div>
          </div>
        </Carousel>
        <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/05/23/audio_4df0344830.mp3" loop />
      </CardContent>
    </Card>
  );
}
