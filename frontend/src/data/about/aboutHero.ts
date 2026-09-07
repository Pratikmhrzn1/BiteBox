import { unsplash } from '../images'

export type HeroBadge = {
  id: string
  icon: 'map-pin'
  label: string
}

export type AboutHeroData = {
  title: string
  subline: string
  badges: HeroBadge[]
  image: string
}

export const aboutHero: AboutHeroData = {
  title: 'Born Bold. Built in Kathmandu.',
  subline: 'Two outlets. One obsession. Endless smash.',
  badges: [
    { id: 'tumbahal', icon: 'map-pin', label: 'Tumbahal, Patan' },
    { id: 'freak-street', icon: 'map-pin', label: 'Freak Street, Basantapur' },
  ],
  image: unsplash('photo-1550547660-d9450f859349', 1600, 65),
}