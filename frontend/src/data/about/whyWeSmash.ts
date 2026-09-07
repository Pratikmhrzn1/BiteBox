/** Keys onto the lucide icon set in FeatureCard, rather than a raw glyph. */
export type AboutFeatureIcon = 'flame' | 'leaf' | 'zap'

export type AboutFeature = {
  id: string
  icon: AboutFeatureIcon
  title: string
  description: string
}

export const whyWeSmash: AboutFeature[] = [
  {
    id: 'fresh',
    icon: 'flame',
    title: 'Fresh Every Day',
    description: 'Patties made to order, never frozen.',
  },
  {
    id: 'real',
    icon: 'leaf',
    title: 'Real Ingredients',
    description: 'Local produce, real cheese, housemade sauces.',
  },
  {
    id: 'fast',
    icon: 'zap',
    title: 'Fast & Loud',
    description: 'Ready in minutes, packed with flavor.',
  },
]