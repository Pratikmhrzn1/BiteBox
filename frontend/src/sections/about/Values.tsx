import SectionHeading from '../../components/common/SectionHeading'
import ValueCard from '../../components/about/ValueCard'
import { values } from '../../data/about'

export default function Values() {
  return (
    <section className="mt-14">
      <SectionHeading>What Makes BiteBox, BiteBox</SectionHeading>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {values.map((value, i) => (
          <ValueCard
            key={value.id}
            value={value}
            variant={i % 2 === 0 ? 'dark' : 'light'}
          />
        ))}
      </div>
    </section>
  )
}
