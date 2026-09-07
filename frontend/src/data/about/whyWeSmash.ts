export type AboutFeature = {
  id: string
  emoji: string
  title: string
  description: string
}

export const whyWeSmash: AboutFeature[] = [
  {
    id: 'fresh',
    emoji: '🔥',
    title: 'Fresh Every Day',
    description: 'Patties made to order, never frozen.',
  },
  {
    id: 'real',
    emoji: '🧀',
    title: 'Real Ingredients',
    description: 'Local produce, real cheese, housemade sauces.',
  },
  {
    id: 'fast',
    emoji: '⚡',
    title: 'Fast & Loud',
    description: 'Ready in minutes, packed with flavor.',
  },
]