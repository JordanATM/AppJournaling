export type Theme = {
  name: 'cozy-evening' | 'serene-garden' | 'soft-night-sky';
  label: string;
  colors: {
    primary: string;
    background: string;
    accent: string;
  };
};

export const themes: Theme[] = [
  {
    name: 'cozy-evening',
    label: 'Noche Acogedora',
    colors: {
      primary: 'hsl(185 23% 55%)',
      background: 'hsl(240 10% 3.9%)',
      accent: 'hsl(127 15% 20%)',
    },
  },
  {
    name: 'serene-garden',
    label: 'Jardín Sereno',
    colors: {
      primary: 'hsl(158 25% 55%)',
      background: 'hsl(35 33% 96%)',
      accent: 'hsl(158 30% 75%)',
    },
  },
  {
    name: 'soft-night-sky',
    label: 'Cielo Nocturno',
    colors: {
      primary: 'hsl(210 30% 55%)',
      background: 'hsl(220 20% 96%)',
      accent: 'hsl(210 30% 75%)',
    },
  },
];
