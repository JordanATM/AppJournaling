export type ThemeName = 'cozy-evening' | 'serene-garden' | 'soft-night-sky' | 'desert-warmth' | 'midnight-forest';

export type Theme = {
  name: ThemeName;
  label: string;
  colors: {
    primary: string;
    primaryForeground: string;
  };
};

export const themes: Theme[] = [
  {
    name: 'cozy-evening',
    label: 'Noche Acogedora',
    colors: {
      primary: 'hsl(185 23% 55%)',
      primaryForeground: 'hsl(185 25% 15%)',
    },
  },
  {
    name: 'serene-garden',
    label: 'Jardín Sereno',
    colors: {
      primary: 'hsl(158 25% 55%)',
      primaryForeground: 'hsl(158 25% 98%)',
    },
  },
  {
    name: 'soft-night-sky',
    label: 'Cielo Nocturno',
    colors: {
      primary: 'hsl(210 30% 55%)',
      primaryForeground: 'hsl(210 30% 98%)',
    },
  },
  {
    name: 'desert-warmth',
    label: 'Calidez Desierto',
    colors: {
        primary: 'hsl(25 80% 60%)',
        primaryForeground: 'hsl(25 80% 98%)',
    }
  },
  {
    name: 'midnight-forest',
    label: 'Bosque Medianoche',
    colors: {
        primary: 'hsl(170 40% 50%)',
        primaryForeground: 'hsl(170 40% 98%)',
    }
  }
];
