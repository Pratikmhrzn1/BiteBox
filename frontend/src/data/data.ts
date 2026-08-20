import {
  categoryBurgerImg,
  categoryDrinksImg,
  categoryNachosImg,
  categorySandwichImg,
} from '../assets'
import { unsplash } from './images'

export type Category = {
  id: string
  icon: string
  label: string
}

export type Hours = {
  label: string
  value: string
}

export type FeaturedBite = {
  id: string
  name: string
  price: number
  description: string
  image: string
}

export const navLinks = ['Home', 'Menu', 'About', 'Contact Us'] as const

export const openingHours = {
  title: 'Opening Hours',
  rows: [{ label: 'Mon–Sun', value: '10 AM – 10 PM' }],
}

export const categories: Category[] = [
  { id: 'burgers', icon: categoryBurgerImg, label: 'Burgers' },
  { id: 'tacos', icon: categorySandwichImg, label: 'Tacos' },
  { id: 'nachos', icon: categoryNachosImg, label: 'Nachos' },
  { id: 'drinks', icon: categoryDrinksImg, label: 'Drinks' },
]

export const locationsTitle = 'Our Locations'

export type Location = {
  id: string
  name: string
  embedUrl: string
}

export const locations: Location[] = [
  {
    id: 'basantapur',
    name: 'Bitebox Basantapur',
    embedUrl:
      'https://maps.google.com/maps?q=Bitebox%20Basantapur&ll=27.7021227,85.3078057&z=17&output=embed',
  },
  {
    id: 'patan',
    name: 'BiteBox Patan',
    embedUrl:
      'https://maps.google.com/maps?q=BiteBox%20Patan&ll=27.6742115,85.3263086&z=17&output=embed',
  },
]

export const heroCopy = {
  accent: 'ENJOY',
  cta: 'Order Now',
}

export const featuredTitle = 'FEATURED BITES'

export const featuredBites: FeaturedBite[] = [
  {
    id: 'fb-1',
    name: 'Classic Smash Burger',
    price: 290,
    description:
      'Double smashed beef patty, melted cheddar, pickles and house sauce on a toasted brioche bun.',
    image: unsplash('photo-1568901346375-23c9450c58cd', 400, 60),
  },
  {
    id: 'fb-2',
    name: 'Crispy Chicken Tacos',
    price: 250,
    description:
      'Golden-fried chicken, cool slaw, avocado crema and lime in warm corn tortillas.',
    image: unsplash('photo-1551504734-5ee1c4a1479b', 400, 60),
  },
  {
    id: 'fb-3',
    name: 'Supreme Loaded Nachos',
    price: 320,
    description:
      'A mountain of tortilla chips piled with seasoned beef, jalapeños, pico de gallo and queso.',
    image: unsplash('photo-1513456852971-30c0b8199d4d', 400, 60),
  },
  {
    id: 'fb-4',
    name: 'Berry Mint Cooler',
    price: 180,
    description:
      'Fresh strawberries and mint shaken with crushed ice — the perfect refreshing sip.',
    image: unsplash('photo-1544145945-f90425340c7e', 400, 60),
  },
]