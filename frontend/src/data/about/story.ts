import bitebox from '../../assets/bitebox.jpeg'
export type AboutStoryData = {
  label: string
  heading: string
  paragraphs: string[]
  image: string
}

export const aboutStory: AboutStoryData = {
  label: 'How It Started',
  heading: 'A Bold Idea. A Real Kitchen.',
  paragraphs: [
    'BiteBox didn\'t start with investors or a business plan. It started with a craving — and the courage to do something about it. What began as a bold idea in Kathmandu slowly turned into something the city couldn\'t stop talking about.',
    'Burgers and tacos made with care, speed, and zero shortcuts. No freezer. No compromise. Just fresh ingredients and a relentless obsession with getting the flavour right — every single time.',
    'Today, BiteBox runs two buzzing outlets — one in the heart of Tumbahal, Patan, and one on the iconic Freak Street, Basantapur. Two locations. Same obsession.',
  ],
  image: bitebox,
}
