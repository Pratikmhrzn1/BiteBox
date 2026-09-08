/** Keys onto the lucide icon set in Numbers, rather than a raw glyph. */
export type AboutStatIcon = 'map-pin' | 'clock' | 'utensils' | 'rocket'

/**
 * Whether the value is a figure or a phrase.
 *
 * Only two of these four stats are actually numbers, and setting all four at
 * one display step was what broke the band: "2" looked orphaned at the size
 * a fifteen-character phrase needed, and the two phrases wrapped anyway. The
 * distinction is a design decision, so it is stated here rather than guessed
 * from string length in the component.
 */
export type AboutStatEmphasis = 'figure' | 'phrase'

export type AboutStat = {
  id: string
  icon: AboutStatIcon
  value: string
  emphasis: AboutStatEmphasis
  label: string
}

export const stats: AboutStat[] = [
  {
    id: 'outlets',
    icon: 'map-pin',
    value: '2',
    emphasis: 'figure',
    label: 'Outlets in Kathmandu',
  },
  {
    id: 'hours',
    icon: 'clock',
    value: '11:30–8:30',
    emphasis: 'figure',
    label: 'Every Day',
  },
  {
    id: 'food',
    icon: 'utensils',
    value: 'Burgers & Tacos',
    emphasis: 'phrase',
    label: 'Done Right',
  },
  {
    id: 'where',
    icon: 'rocket',
    value: 'Est. Kathmandu',
    emphasis: 'phrase',
    label: 'Nepal',
  },
]
