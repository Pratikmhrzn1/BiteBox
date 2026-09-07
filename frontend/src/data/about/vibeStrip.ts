import { unsplash } from '../images'

export const vibeStrip: { id: string; src: string; alt: string }[] = [
  {
    id: 'smash',
    src: unsplash('photo-1550547660-d9450f859349', 800, 60),
    alt: 'A smashed burger up close',
  },
  {
    id: 'taco',
    src: unsplash('photo-1552332386-f8dd00dc2f85', 800, 60),
    alt: 'Tacos on a tray',
  },
  {
    id: 'street',
    src: unsplash('photo-1595877244574-e90ce41ce089', 800, 60),
    alt: 'Street food being grilled',
  },
  {
    id: 'kitchen',
    src: unsplash('photo-1556910103-1c02745aae4d', 800, 60),
    alt: 'Inside a busy kitchen',
  },
  {
    id: 'fries',
    src: unsplash('photo-1573080496219-bb080dd4f877', 800, 60),
    alt: 'Crispy fries with dipping sauce',
  },
]
