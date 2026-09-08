export type Outlet = {
  id: string
  place: string
  hours: string
  tag: string
  /** Google Maps embed for the card itself. */
  embedUrl: string
  /** Opens turn-by-turn directions to the same coordinates. */
  directionsUrl: string
}

/* Coordinates are the ones the home page's map cards already use
 * (src/data/home/locations.ts), so the two pages can never point at
 * different corners of Kathmandu for the same outlet. The cards used to show
 * stock photographs instead - a forest cabin and a palm-tree resort standing
 * in for Patan and Basantapur. */
export const outlets: Outlet[] = [
  {
    id: 'tumbahal',
    place: 'Tumbahal, Patan',
    hours: '11:30 AM – 8:30 PM',
    tag: 'Outlet 01',
    embedUrl:
      'https://maps.google.com/maps?q=BiteBox%20Patan&ll=27.6742115,85.3263086&z=17&output=embed',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=27.6742115%2C85.3263086',
  },
  {
    id: 'freak-street',
    place: 'Freak Street, Basantapur',
    hours: '11:30 AM – 8:30 PM',
    tag: 'Outlet 02',
    embedUrl:
      'https://maps.google.com/maps?q=Bitebox%20Basantapur&ll=27.7021227,85.3078057&z=17&output=embed',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=27.7021227%2C85.3078057',
  },
]
