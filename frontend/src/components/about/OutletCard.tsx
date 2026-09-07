import { MapPin, Clock, Navigation } from 'lucide-react'
import { unsplashSrcSet } from '../../data/images'
import { buttonClass } from '../common/Button'
import type { Outlet } from '../../data/about'

type OutletCardProps = {
  outlet: Outlet
  onLocationOpen: () => void
}

export default function OutletCard({ outlet, onLocationOpen }: OutletCardProps) {
  return (
    <article className="group overflow-hidden rounded-card border-2 border-ink-dark bg-header-brown shadow-comic-md transition-[transform,box-shadow] duration-base ease-ui hover:-translate-y-0.5 hover:shadow-comic-lg">
      <div className="relative aspect-[16/9] overflow-hidden border-b-2 border-ink-dark">
        <img
          src={outlet.image}
          srcSet={unsplashSrcSet(outlet.image)}
          sizes="(min-width: 768px) 34rem, 92vw"
          alt={outlet.place}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-slow ease-ui group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full border-2 border-ink-dark bg-amber px-3 py-1 font-sans text-xs font-bold uppercase text-ink-dark shadow-comic-xs">
          {outlet.tag}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
          <h3 className="font-display text-display-sm text-card-bg">
            {outlet.place}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
          <p className="font-sans text-body font-semibold text-cream">
            {outlet.hours}
          </p>
        </div>
        <button
          type="button"
          onClick={onLocationOpen}
          className={buttonClass({ size: 'md', className: 'mt-1 w-full' })}
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Get Directions
        </button>
      </div>
    </article>
  )
}
