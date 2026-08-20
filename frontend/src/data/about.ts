import { unsplash } from './images'

export type AboutFeature = {
  id: string
  emoji: string
  title: string
  description: string
}

export type TeamMember = {
  id: string
  name: string
  title: string
  photo: string
}

const img = (id: string) => unsplash(id, 800, 60)

export const aboutHero = {
  title: "We Don't Just Make Burgers.",
  subtitle: 'We make moments.',
  image: img('photo-1550547660-d9450f859349'),
}

export const storyCopy =
  'BiteBox started in a small kitchen in Lalitpur with one obsession — the perfect smash. Every patty is pressed hard, seared fast, and loaded with flavor. No shortcuts. No freezer. Just fresh.'

export const storyImage = img('photo-1556910103-1c02745aae4d')

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

export const team: TeamMember[] = [
  {
    id: 'smasher',
    name: 'Suraj Shrestha',
    title: 'The Smasher',
    photo: img('photo-1560250097-0b93528c311a'),
  },
  {
    id: 'sauce',
    name: 'Anisha Gurung',
    title: 'The Sauce Whisperer',
    photo: img('photo-1573496359142-b8d87734a5a2'),
  },
  {
    id: 'fry-guy',
    name: 'Bikash Tamang',
    title: 'The Fry Guy',
    photo: img('photo-1507003211169-0a1dd7228f2d'),
  },
]

export const ctaCopy = {
  title: 'Ready to get smashed?',
  buttonLabel: 'Order Now',
}