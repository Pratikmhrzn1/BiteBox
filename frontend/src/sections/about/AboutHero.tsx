import { MapPin } from 'lucide-react'
import { unsplashSrcSet } from '../../data/images'
import type { AboutHeroData } from '../../data/about'

type AboutHeroProps = {
  hero: AboutHeroData
}

export default function AboutHero({ hero }: AboutHeroProps) {
  return (
    <section className="relative flex min-h-[26rem] items-end overflow-hidden rounded-card bg-espresso-black sm:min-h-[30rem]">
      <img
        src={hero.image}
        srcSet={unsplashSrcSet(hero.image)}
        sizes="100vw"
        alt="A moody smashed burger"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Deep left-side bury keeps the heading legible while leaving the
          burger visible on the right. */}
      <div className="absolute inset-0 bg-gradient-to-r from-espresso-black via-espresso-black/80 to-espresso-black/20" />

      <div className="relative z-10 flex max-w-2xl flex-col gap-4 p-8 sm:p-12 lg:p-16">
        <h1
          className="stagger-enter font-display text-display-xl leading-none text-white"
          style={{ '--stagger-delay': '0ms' } as React.CSSProperties}
        >
          {hero.title}
        </h1>
        <p
          className="stagger-enter font-sans text-lg text-cream"
          style={{ '--stagger-delay': '100ms' } as React.CSSProperties}
        >
          {hero.subline}
        </p>
        <div
          className="stagger-enter flex flex-wrap gap-3 pt-1"
          style={{ '--stagger-delay': '200ms' } as React.CSSProperties}
        >
          {hero.badges.map((badge) => (
            <span
              key={badge.id}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-dark bg-amber px-4 py-2 font-sans text-sm font-bold text-ink-dark shadow-comic-sm"
            >
              <MapPin
                className="h-4 w-4 shrink-0"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              {badge.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
