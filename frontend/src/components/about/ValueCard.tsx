import { Flame, Hamburger, Sandwich } from 'lucide-react'
import type { AboutValue, AboutValueIcon } from '../../data/about'

/** Keys onto the lucide icon set, so data never ships a raw glyph. */
const ICONS: Record<AboutValueIcon, typeof Hamburger> = {
  hamburger: Hamburger,
  sandwich: Sandwich,
  flame: Flame,
}

type ValueCardProps = {
  value: AboutValue
  variant: 'dark' | 'light'
}

export default function ValueCard({ value, variant }: ValueCardProps) {
  const Icon = ICONS[value.icon]
  const isDark = variant === 'dark'
  const surface = isDark ? 'bg-header-brown text-card-bg' : 'card-comic'
  const emojiTile = isDark
    ? 'border-2 border-ink-dark bg-amber text-ink-dark shadow-comic-sm'
    : 'border-2 border-ink-dark bg-header-brown text-amber shadow-comic-sm'
  const titleColor = isDark ? 'text-amber' : 'text-header-brown'

  return (
    <article
      className={`flex flex-col items-center rounded-card border-2 border-ink-dark p-6 text-center shadow-comic transition-[transform,box-shadow] duration-base ease-ui hover:-translate-y-0.5 hover:shadow-comic-md ${surface}`}
    >
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-card ${emojiTile}`}
        aria-hidden="true"
      >
        <Icon className="h-8 w-8" />
      </span>
      <h3 className={`mt-4 font-display text-display-sm ${titleColor}`}>
        {value.title}
      </h3>
      <p
        className={`mt-2 font-sans text-body leading-relaxed ${
          isDark ? 'text-cream' : 'text-ink-muted'
        }`}
      >
        {value.description}
      </p>
    </article>
  )
}
