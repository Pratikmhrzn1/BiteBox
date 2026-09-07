export type Founder = {
  id: string
  name: string
  title: string
  role: string
  bio: string
  quote: string
}

export const founders: Founder[] = [
  {
    id: 'sanskar',
    name: 'Sanskar Pandey',
    title: 'The Idea',
    role: 'Co-Founder',
    bio: 'Started BiteBox with nothing but a recipe, a rented counter, and the belief that Kathmandu deserved better street food. Still personally involved in every menu decision.',
    quote: "We didn't wait for the perfect moment. We just started.",
  },
  {
    id: 'roshni',
    name: 'Roshni Nepali',
    title: 'The Drive',
    role: 'Co-Founder',
    bio: 'Handles the operations, the vibe, and the vision. Believes the experience around the food matters just as much as what\'s on the plate.',
    quote: 'Passion got us started. Persistence kept us going.',
  },
]
