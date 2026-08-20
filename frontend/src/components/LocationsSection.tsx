import { MapPin } from 'lucide-react'
import type { Location } from '../data/data'
import SectionHeading from './SectionHeading'

type LocationsSectionProps = {
  title: string
  locations: Location[]
}

export default function LocationsSection({
  title,
  locations,
}: LocationsSectionProps) {
  return (
    <section id="locations" className="mt-12 scroll-mt-24">
      <SectionHeading>{title}</SectionHeading>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {locations.map((location) => (
          <div
            key={location.id}
            className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-ink-dark/10"
          >
            <div className="flex items-center gap-2 border-b border-ink-dark/10 px-5 py-3.5">
              <MapPin
                className="h-4 w-4 text-accent-red"
                aria-hidden="true"
              />
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
        ))}
      </div>
    </section>
  )
}