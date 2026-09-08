import SectionHeading from '../../components/common/SectionHeading'
import Reveal from '../../components/common/Reveal'
import FounderCard from '../../components/about/FounderCard'
import { founders } from '../../data/about'
import { roshniImg, sanskarImg } from '../../assets'

/** Sanskar (The Idea) on amber quote, Roshni (The Drive) on dark. */
const FOUNDER_PHOTOS = [sanskarImg, roshniImg] as const

export default function Founders() {
  return (
    <section className="mt-16 sm:mt-20">
      <Reveal>
        <SectionHeading>The Founders</SectionHeading>
      </Reveal>
      <Reveal
        stagger
        delay={100}
        className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {founders.map((founder, i) => (
          <FounderCard
            key={founder.id}
            founder={founder}
            photo={FOUNDER_PHOTOS[i]}
            quoteVariant={i === 0 ? 'amber' : 'dark'}
          />
        ))}
      </Reveal>
    </section>
  )
}
