import SectionHeading from '../../components/common/SectionHeading'
import Reveal from '../../components/common/Reveal'
import OutletCard from '../../components/about/OutletCard'
import { outlets } from '../../data/about'

export default function Locations() {
  return (
    <section id="locations" className="mt-16 scroll-mt-header-gap sm:mt-20">
      <Reveal>
        <SectionHeading>Two Locations, One Soul</SectionHeading>
      </Reveal>
      <Reveal
        stagger
        delay={100}
        className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {outlets.map((outlet) => (
          <OutletCard key={outlet.id} outlet={outlet} />
        ))}
      </Reveal>
    </section>
  )
}
