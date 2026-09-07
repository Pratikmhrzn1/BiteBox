export type Location = {
  id: string
  name: string
  embedUrl: string
}

export const locationsTitle = 'Our Locations'

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