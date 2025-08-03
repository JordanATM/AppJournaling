
export type Theme = {
  name: string;
  className: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
};

export const themes: Theme[] = [
  {
    name: 'Jardín Sereno',
    className: 'theme-serene-garden',
    colors: {
      primary: '#A7D1AB',
      accent: '#70A4A9',
      background: '#F5F5DC',
    },
  },
  {
    name: 'Cielo Nocturno Suave',
    className: 'theme-soft-night',
    colors: {
      primary: '#a7b4d1',
      accent: '#a970a4',
      background: '#e0e0f0',
    },
  },
  {
    name: 'Calidez del Desierto',
    className: 'theme-desert-warmth',
    colors: {
      primary: '#D1B4A7',
      accent: '#A98C70',
      background: '#F5E5DC',
    },
  },
  {
    name: 'Bosque de Medianoche',
    className: 'theme-midnight-forest',
    colors: {
      primary: '#A7C4D1',
      accent: '#708AA9',
      background: '#DCE4F5',
    },
  },
];
