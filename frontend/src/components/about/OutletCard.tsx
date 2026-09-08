import { MapPin, Clock, Navigation } from 'lucide-react'
import { buttonClass } from '../common/Button'
import type { Outlet } from '../../data/about'

type OutletCardProps = {
  outlet: Outlet
}

export default function OutletCard({ outlet }: OutletCardProps) {
  return (
    /* No hover lift here, unlike the other cards on the page. The map is
     * interactive content rather than a link, and a browser does not forward
     * pointer events from inside an iframe to its parent - so a lift would
     * fire on the card's edges and die the moment you touched the map. */
    <article className="overflow-hidden rounded-card border-2 border-ink-dark bg-header-brown shadow-comic-md">
      <div className="relative aspect-[16/10] border-b-2 border-ink-dark bg-card-bg">
        <iframe
          src={outlet.embedUrl}
          title={`${outlet.place} on Google Maps`}
          className="h-full w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="flex flex-col gap-3 p-5">
        {/* The tag used to be stamped on the map's top-left corner, which is
            exactly where Google anchors its own place card - it covered the
            address and rating. It belongs beside the name anyway: it labels
            the outlet, not the map. */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
            <h3 className="font-display text-display-sm text-card-bg">
              {outlet.place}
            </h3>
          </div>
          <span className="mt-0.5 shrink-0 rounded-full border-2 border-ink-dark bg-amber px-3 py-1 font-sans text-xs font-bold uppercase text-ink-dark shadow-comic-xs">
            {outlet.tag}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
          <p className="font-sans text-body font-semibold text-cream">
            {outlet.hours}
          </p>
        </div>
        {/* Now that the map is in the card, this goes straight to directions
            rather than bouncing to another page to show the same map. */}
        <a
          href={outlet.directionsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={buttonClass({ size: 'md', className: 'mt-1 w-full' })}
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Get directions
        </a>
      </div>
    </article>
  )
}
