import type { Founder } from '../../data/about'

type FounderCardProps = {
  founder: Founder
  photo: string
  /** Alternates the quote balloon surface so the two cards read as a pair. */
  quoteVariant: 'amber' | 'dark'
}

export default function FounderCard({
  founder,
  photo,
  quoteVariant,
}: FounderCardProps) {
  const quoteClasses =
    quoteVariant === 'amber'
      ? 'balloon-amber border-2 border-ink-dark bg-amber text-ink-dark shadow-comic-sm'
      : 'balloon-dark border-2 border-ink-dark bg-header-brown text-amber shadow-comic-sm'

  return (
    /* Portrait beside the bio rather than above it. The square photo used to
     * set the card's width as its height, so two founders ran ~890px on a
     * 1280 screen and the section could not be seen at once. Beside it, the
     * photo takes its height from the text it sits next to. */
    <article className="card-comic group flex flex-col overflow-hidden rounded-card transition-[transform,box-shadow] duration-base ease-ui hover:-translate-y-1 hover:shadow-comic-md sm:flex-row">
      <div className="relative aspect-[3/2] shrink-0 overflow-hidden border-b-2 border-ink-dark sm:aspect-auto sm:w-44 sm:border-b-0 sm:border-r-2 lg:w-52">
        <img
          src={photo}
          alt={`${founder.name}, ${founder.role}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-slower ease-ui group-hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 rounded-full border-2 border-ink-dark bg-card-bg px-3 py-1 font-sans text-xs font-bold uppercase text-ink-dark shadow-comic-xs transition-transform duration-base ease-ui group-hover:-translate-y-0.5">
          {founder.role}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-display-sm text-header-brown">
          {founder.title}
        </h3>
        <p className="mt-1 font-sans text-sm font-bold text-accent-red">
          {founder.name}
        </p>
        <p className="mt-2 flex-1 font-sans text-body leading-relaxed text-ink-muted">
          {founder.bio}
        </p>
        {/* Stacked, the tail points up at the photo above it; alongside, it
            swings to the left edge and points at the photo beside it. Either
            way the quote is attributed by where it points. */}
        <blockquote
          className={`balloon balloon-sm-left mt-7 rounded-chip px-5 py-4 font-script text-xl leading-snug sm:mt-5 ${quoteClasses}`}
        >
          “{founder.quote}”
        </blockquote>
      </div>
    </article>
  )
}
