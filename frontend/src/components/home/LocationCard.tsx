import { MapPin } from 'lucide-react'
import type { Location } from '../../data/home'

type LocationCardProps = {
  location: Location
}

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-ink-dark/10">
      <div className="flex items-center gap-2 border-b border-ink-dark/10 px-5 py-3.5">
        <MapPin className="h-4 w-4 text-accent-red" aria-hidden="true" />
        <h3 className="font-sans text-base font-semibold text-ink-dark">
          {location.name}
        </h3>
      </div>
      <div className="h-64 w-full">
        <iframe
          src={location.embedUrl}
          title={`${location.name} on Google Maps`}
          className="h-full w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
