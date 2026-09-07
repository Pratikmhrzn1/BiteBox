/** Keys onto the lucide icon set in Numbers, rather than a raw glyph. */
export type AboutStatIcon = 'map-pin' | 'clock' | 'utensils' | 'rocket'

export type AboutStat = {
  id: string
  icon: AboutStatIcon
  value: string
  label: string
}

export const stats: AboutStat[] = [
  { id: 'outlets', icon: 'map-pin', value: '2', label: 'Outlets in Kathmandu' },
  { id: 'hours', icon: 'clock', value: '11:30–8:30', label: 'Every Day' },
  { id: 'food', icon: 'utensils', value: 'Burgers & Tacos', label: 'Done Right' },
  { id: 'where', icon: 'rocket', value: 'Est. Kathmandu', label: 'Nepal' },
]