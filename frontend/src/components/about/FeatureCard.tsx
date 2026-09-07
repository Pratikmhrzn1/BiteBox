import { Flame, Leaf, Zap } from 'lucide-react'
import type { AboutFeature, AboutFeatureIcon } from '../../data/about'

type FeatureCardProps = {
  feature: AboutFeature
}

/** Emoji rendered differently on every platform and could not take a colour. */
const ICONS: Record<AboutFeatureIcon, typeof Flame> = {
  flame: Flame,
  leaf: Leaf,
  zap: Zap,
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = ICONS[feature.icon]

  return (
    <div className="card-comic rounded-card p-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-card border-2 border-ink-dark bg-amber text-ink-dark shadow-comic-sm">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-display-sm uppercase text-header-brown">
        {feature.title}
      </h3>
      <p className="mt-2 font-sans text-body leading-relaxed text-ink-muted">
        {feature.description}
      </p>
    </div>
  )
}
