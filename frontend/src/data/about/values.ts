/** Keys onto the lucide icon set in ValueCard, rather than a raw glyph. */
export type AboutValueIcon = 'hamburger' | 'sandwich' | 'flame'

export type AboutValue = {
  id: string
  icon: AboutValueIcon
  title: string
  description: string
}

export const values: AboutValue[] = [
  {
    id: 'smash',
    icon: 'hamburger',
    title: 'The Smash',
    description:
      'Every patty is pressed hard and seared fast. That crispy edge isn\'t an accident — it\'s the whole point.',
  },
  {
    id: 'taco',
    icon: 'sandwich',
    title: 'The Taco',
    description:
      'Not an afterthought. BiteBox tacos have their own fanbase for a reason.',
  },
  {
    id: 'hustle',
    icon: 'flame',
    title: 'The Hustle',
    description:
      'Two outlets built from a bold idea and sheer persistence. No shortcuts in the kitchen, no shortcuts in life.',
  },
]