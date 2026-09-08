import Button from '../../components/common/Button'
import Reveal from '../../components/common/Reveal'
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
    <section className="relative mt-16 overflow-hidden rounded-panel border-2 border-ink-dark bg-espresso-black px-6 py-14 text-center shadow-comic-lg sm:mt-24 sm:px-12 sm:py-20">
      {/* A flat near-black slab this size reads as a hole in the page. The
          wash is the same amber the buttons and badges use, at the opacity
          where it registers as the band being lit from above rather than as
          a gradient in its own right. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_75%_at_50%_0%,rgba(255,201,60,0.12),rgba(255,201,60,0))]"
      />

      {/* Heading first, then the line that qualifies it, then the controls -
          the order the eye needs them in. */}
      <Reveal stagger className="relative">
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
          <Button size="lg" variant="secondary" onClick={onLocationOpen}>
            {cta.findLabel}
          </Button>
        </div>
      </Reveal>
    </section>
  )
}
