import type { Location } from '../../data/data'
import SectionHeading from '../../components/common/SectionHeading'
import LocationCard from '../../components/home/LocationCard'

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
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </section>
  )
}
