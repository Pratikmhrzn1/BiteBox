import type { AboutFeature } from '../../data/about'

type FeatureCardProps = {
  feature: AboutFeature
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="card-comic rounded-2xl p-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink-dark bg-amber text-2xl shadow-[3px_3px_0_#241A12]">
        {feature.emoji}
      </span>
      <h3 className="mt-4 font-display text-xl uppercase text-header-brown">
        {feature.title}
      </h3>
      <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
        {feature.description}
      </p>
    </div>
  )
}
