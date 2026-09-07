import { unsplash } from '../images'

export type Outlet = {
  id: string
  place: string
  hours: string
  image: string
  tag: string
}

export const outlets: Outlet[] = [
  {
    id: 'tumbahal',
    place: 'Tumbahal, Patan',
    hours: '11:30 AM – 8:30 PM',
    image: unsplash('photo-1595877244574-e90ce41ce089', 1200, 60),
    tag: 'Outlet 01',
  },
  {
    id: 'freak-street',
    place: 'Freak Street, Basantapur',
    hours: '11:30 AM – 8:30 PM',
    image: unsplash('photo-1551882547-ff40c63fe5fa', 1200, 60),
    tag: 'Outlet 02',
  },
]
