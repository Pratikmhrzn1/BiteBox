import { unsplashSrcSet } from '../../data/images'
import { vibeStrip } from '../../data/about'

export default function VibeStrip() {
  return (
    <section className="mt-14">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {vibeStrip.map((item) => (
          <figure
            key={item.id}
            className="h-52 w-72 shrink-0 snap-start overflow-hidden rounded-card border-2 border-ink-dark shadow-comic-sm"
          >
            <img
              src={item.src}
              srcSet={unsplashSrcSet(item.src)}
              sizes="18rem"
              alt={item.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </figure>
        ))}
      </div>
    </section>
  )
}
