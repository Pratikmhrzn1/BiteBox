import SectionHeading from '../../components/common/SectionHeading'
import FeatureCard from '../../components/about/FeatureCard'
import type { AboutFeature } from '../../data/about'

type WhyWeSmashProps = {
  features: AboutFeature[]
}

export default function WhyWeSmash({ features }: WhyWeSmashProps) {
  return (
    <section className="mt-14">
      <SectionHeading>Why We Smash</SectionHeading>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  )
}
