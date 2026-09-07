import type { Founder } from '../../data/about'

type FounderCardProps = {
  founder: Founder
  photo: string
  /** Alternates the quote tile surface so the two cards read as a pair. */
  quoteVariant: 'amber' | 'dark'
}

export default function FounderCard({
  founder,
  photo,
  quoteVariant,
}: FounderCardProps) {
  const quoteClasses =
    quoteVariant === 'amber'
      ? 'border-2 border-ink-dark bg-amber text-ink-dark shadow-comic-sm'
      : 'border-2 border-ink-dark bg-header-brown text-amber shadow-comic-sm'

  return (
    <article className="card-comic group flex flex-col overflow-hidden rounded-card transition-[transform,box-shadow] duration-base ease-ui hover:-translate-y-0.5 hover:shadow-comic-md">
      <div className="relative aspect-square overflow-hidden border-b-2 border-ink-dark">
        <img
          src={photo}
          alt={`${founder.name}, ${founder.role}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-slow ease-ui group-hover:scale-105"
        />
        <span className="absolute left-3 bottom-3 rounded-full border-2 border-ink-dark bg-card-bg px-3 py-1 font-sans text-xs font-bold uppercase text-ink-dark shadow-comic-xs">
          {founder.role}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-display-md text-header-brown">
          {founder.title}
        </h3>
        <p className="mt-0.5 font-sans text-sm font-bold text-accent-red">
          {founder.name} · {founder.role}
        </p>
        <p className="mt-3 flex-1 font-sans text-body leading-relaxed text-ink-muted">
          {founder.bio}
        </p>
        <blockquote
          className={`mt-4 rounded-chip px-4 py-3 font-script text-2xl leading-snug ${quoteClasses}`}
        >
          “{founder.quote}”
        </blockquote>
      </div>
    </article>
  )
}
