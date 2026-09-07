import SectionHeading from '../../components/common/SectionHeading'
import OutletCard from '../../components/about/OutletCard'
import { outlets } from '../../data/about'

type LocationsProps = {
  onLocationOpen: () => void
}

export default function Locations({ onLocationOpen }: LocationsProps) {
  return (
    <section className="mt-14">
      <SectionHeading>Two Locations, One Soul</SectionHeading>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {outlets.map((outlet) => (
          <OutletCard
            key={outlet.id}
            outlet={outlet}
            onLocationOpen={onLocationOpen}
          />
        ))}
      </div>
    </section>
  )
}
