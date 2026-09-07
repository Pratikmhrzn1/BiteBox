import { unsplash } from '../images'

export type TeamMember = {
  id: string
  name: string
  title: string
  photo: string
}

const img = (id: string) => unsplash(id, 800, 60)

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