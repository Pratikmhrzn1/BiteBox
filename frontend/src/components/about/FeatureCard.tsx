import type { AboutFeature } from '../../data/about'

type FeatureCardProps = {
  feature: AboutFeature
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="card-comic rounded-card p-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-card border-2 border-ink-dark bg-amber text-2xl shadow-comic-sm">
        {feature.emoji}
      </span>
      <h3 className="mt-4 font-display text-xl uppercase text-header-brown">
        {feature.title}
      </h3>
      <p className="mt-2 font-sans text-body leading-relaxed text-ink-muted">
        {feature.description}
      </p>
    </div>
  )
}
