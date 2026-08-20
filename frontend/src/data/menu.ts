import { unsplash } from './images'

export type MenuCategory = 'Burgers' | 'Tacos' | 'Nachos' | 'Drinks'

export type MenuItem = {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: MenuCategory
  bestSeller?: boolean
}

export type CartExtra = {
  id: string
  label: string
  price: number
}

export const CART_EXTRAS: CartExtra[] = [
  { id: 'extra-cheese', label: 'Extra Cheese', price: 40 },
  { id: 'spicy-sauce', label: 'Spicy Sauce', price: 20 },
  { id: 'double-patty', label: 'Double Patty', price: 80 },
]

export const menuCategories = ['All', 'Burgers', 'Tacos', 'Nachos', 'Drinks'] as const

const img = (id: string) => unsplash(id, 400, 60)

export const menuItems: MenuItem[] = [
  {
    id: 'smashed-chicken-burger',
    name: 'Smashed Chicken Burger',
    price: 290,
    description: 'Crispy smashed chicken patty with tangy slaw and house sauce.',
    image: img('photo-1568901346375-23c9450c58cd'),
    category: 'Burgers',
    bestSeller: true,
  },
  {
    id: 'double-smashed-burger',
    name: 'Double Smashed Burger',
    price: 390,
    description: 'Two jucy smashed patties, double cheese, grilled onions.',
    image: img('photo-1553979459-d2229ba7433b'),
    category: 'Burgers',
  },
  {
    id: 'veg-smash-burger',
    name: 'Veg Smash Burger',
    price: 220,
    description: 'Crunchy veg patty with lettuce, tomato and smoky aioli.',
    image: img('photo-1571091718767-18b5b1457add'),
    category: 'Burgers',
  },
  {
    id: 'smashed-taco',
    name: 'Smashed Taco',
    price: 190,
    description: 'Smash-grilled filling in warm tortillas with pico de gallo.',
    image: img('photo-1565299585323-38d6b0865b47'),
    category: 'Tacos',
  },
  {
    id: 'crispy-chicken-taco',
    name: 'Crispy Chicken Taco',
    price: 210,
    description: 'Golden-fried chicken, creamy slaw and lime crema.',
    image: img('photo-1599974579688-8dbdd335c77f'),
    category: 'Tacos',
  },
  {
    id: 'loaded-nachos',
    name: 'Loaded Nachos',
    price: 180,
    description: 'Tortilla chips piled high with cheese, beans and jalapeños.',
    image: img('photo-1513456852971-30c0b8199d4d'),
    category: 'Nachos',
  },
  {
    id: 'classic-fries',
    name: 'Classic Fries',
    price: 120,
    description: 'Crispy golden fries with a dusting of special seasoning.',
    image: img('photo-1573080496219-bb080dd4f877'),
    category: 'Nachos',
  },
  {
    id: 'mango-lassi',
    name: 'Mango Lassi',
    price: 130,
    description: 'Thick, sweet mango yogurt shake — cool and refreshing.',
    image: img('photo-1544145945-f90425340c7e'),
    category: 'Drinks',
  },
]