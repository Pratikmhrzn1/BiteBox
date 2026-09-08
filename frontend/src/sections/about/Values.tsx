import SectionHeading from '../../components/common/SectionHeading'
import Reveal from '../../components/common/Reveal'
import ValueCard from '../../components/about/ValueCard'
import { values } from '../../data/about'

export default function Values() {
  return (
    <section className="mt-16 sm:mt-20">
      <Reveal>
        <SectionHeading>What Makes BiteBox, BiteBox</SectionHeading>
      </Reveal>
      <Reveal
        stagger
        delay={100}
        className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {values.map((value, i) => (
          <ValueCard
            key={value.id}
            value={value}
            variant={i % 2 === 0 ? 'light' : 'dark'}
          />
        ))}
      </Reveal>
    </section>
  )
}
