import SectionHeading from '../../components/common/SectionHeading'
import FounderCard from '../../components/about/FounderCard'
import { founders } from '../../data/about'
import { roshniImg, sanskarImg } from '../../assets'

/** Sanskar (The Idea) on amber quote, Roshni (The Drive) on dark. */
const FOUNDER_PHOTOS = [sanskarImg, roshniImg] as const

export default function Founders() {
  return (
    <section className="mt-14">
      <SectionHeading>The Founders</SectionHeading>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {founders.map((founder, i) => (
          <FounderCard
            key={founder.id}
            founder={founder}
            photo={FOUNDER_PHOTOS[i]}
            quoteVariant={i === 0 ? 'amber' : 'dark'}
          />
        ))}
      </div>
    </section>
  )
}
