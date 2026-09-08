import { Clock, MapPin, Rocket, Utensils } from 'lucide-react'
import Reveal from '../../components/common/Reveal'
import { stats } from '../../data/about'
import type { AboutStatEmphasis, AboutStatIcon } from '../../data/about'

/** Keys onto the lucide icon set, so data never ships a raw glyph. */
const ICONS: Record<AboutStatIcon, typeof MapPin> = {
  'map-pin': MapPin,
  clock: Clock,
  utensils: Utensils,
  rocket: Rocket,
}

/* Two steps, not one. A figure is short enough to carry the big step and
 * needs it to read as the point of the cell; a phrase at that step wrapped to
 * two lines in a 260px column and stopped looking like a stat at all. */
const VALUE_SIZE: Record<AboutStatEmphasis, string> = {
  figure: 'text-display-md',
  phrase: 'text-display-sm',
}

export default function Numbers() {
  return (
    <section className="mt-16 overflow-hidden rounded-panel border-2 border-ink-dark bg-header-brown shadow-comic-lg sm:mt-24">
      {/* Four columns with gaps read as four floating stacks. Closing the
          gap at lg and hairlining between the cells is what makes them read
          as one band; below lg there are only two per row, which needs no
          help. */}
      <Reveal
        stagger
        className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 sm:p-10 lg:grid-cols-4 lg:gap-0 lg:px-4"
      >
        {stats.map((stat) => {
          const Icon = ICONS[stat.icon]
          return (
            <div
              key={stat.id}
              className="flex h-full flex-col items-center border-amber/20 text-center lg:border-l-2 lg:px-6 lg:first:border-l-0"
            >
              {/* amber/15 on brown had no discernible edge - the icons read
                  as floating, not as tiles. The ring is what separates
                  them from the ground. */}
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-amber/40 bg-amber/10 text-amber">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              {/* flex-1 lets a wrapped phrase grow upward while the label
                  below stays pinned to a shared baseline across the row. */}
              <p
                className={`mt-3 flex flex-1 items-center text-balance font-display text-amber ${
                  VALUE_SIZE[stat.emphasis]
                }`}
              >
                {stat.value}
              </p>
              <p className="mt-2 font-sans text-body font-semibold text-cream">
                {stat.label}
              </p>
            </div>
          )
        })}
      </Reveal>
    </section>
  )
}
