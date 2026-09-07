import Button from '../../components/common/Button'
import type { AboutCtaData } from '../../data/about'

type AboutCtaProps = {
  cta: AboutCtaData
  onOrderNow: () => void
  onLocationOpen: () => void
}

export default function AboutCta({
  cta,
  onOrderNow,
  onLocationOpen,
}: AboutCtaProps) {
  return (
    <section className="mt-14 overflow-hidden rounded-card border-2 border-ink-dark bg-espresso-black px-6 py-12 text-center shadow-comic-md sm:px-12 sm:py-16">
      <h2 className="font-display text-display-lg text-white">
        {cta.heading}
      </h2>
      <p className="mx-auto mt-3 max-w-md font-sans text-body-lg text-cream">
        {cta.subtext}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" onClick={onOrderNow}>
          {cta.orderLabel}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={onLocationOpen}
        >
          {cta.findLabel}
        </Button>
      </div>
    </section>
  )
}
