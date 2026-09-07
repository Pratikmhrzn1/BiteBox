import { Clock, MapPin, Rocket, Utensils } from 'lucide-react'
import { stats } from '../../data/about'
import type { AboutStatIcon } from '../../data/about'

/** Keys onto the lucide icon set, so data never ships a raw glyph. */
const ICONS: Record<AboutStatIcon, typeof MapPin> = {
  'map-pin': MapPin,
  clock: Clock,
  utensils: Utensils,
  rocket: Rocket,
}

export default function Numbers() {
  return (
    <section className="mt-14 overflow-hidden rounded-card border-2 border-ink-dark bg-header-brown shadow-comic-md">
      <div className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = ICONS[stat.icon]
          return (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber/15 text-amber">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-3 font-display text-display-md text-amber">
                {stat.value}
              </p>
              <p className="mt-1 font-sans text-body font-semibold text-cream">
                {stat.label}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
