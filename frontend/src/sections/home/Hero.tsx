import { heroBurgerImg } from '../../assets'
import type { HeroContent } from '../../api/content'
import { buttonClass } from '../../components/common/Button'

type HeroProps = {
  copy: HeroContent
  onCta: () => void
}

export default function Hero({ copy, onCta }: HeroProps) {
  return (
    <section className="relative flex min-h-[26rem] items-stretch overflow-hidden rounded-panel text-white shadow-comic-md">
      <img
        src={heroBurgerImg}
        alt="A delicious BiteBox burger"
        /* This is the page's LCP element, so it must not wait its turn. */
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* The scrim carried one gradient at every width. Above lg the copy is
          penned into w-[55%] and stays in the dark end, but below lg it goes
          full-width and ran into the 20% tail - at 390px "smash burgers" sat
          on the lit cheese.
          Sampled off the composited pixels at 390/768/1440: the old scrim
          measured 3.27:1 on mobile and 5.16:1 on tablet, so the failure was
          mobile-only. This one measures 4.96:1, 6.35:1 and 5.97:1.
          The floor is the measured minimum rather than a safe guess. A
          heavier scrim also cleared AA and turned the burger to mud - the
          photograph is the product, so it keeps every stop it can afford. */}
      <div className="absolute inset-0 bg-gradient-to-br from-espresso-dark via-espresso-dark/75 to-espresso-dark/55 lg:via-espresso-dark/70 lg:to-espresso-dark/20" />

      <div className="relative z-10 flex w-full flex-col justify-center gap-1 p-8 sm:p-10 lg:w-[55%] lg:p-12">
        {/* font-display, not font-titan. The hero was the only place in the
            product set in Titan One while all 41 other headings used Luckiest
            Guy, so the brand changed face at its loudest moment. No font-bold
            either: Luckiest Guy ships one weight and the browser was
            synthesising a smeared faux bold at 60px+. Size and leading come
            from the display-* tokens. */}
        <h1
          className="stagger-enter font-display text-display-xl"
          style={{ '--stagger-delay': '0ms' } as React.CSSProperties}
        >
          {copy.line1}
          <br />
          {/* Caveat is loaded at 600/700, so this weight is real. */}
          <span className="font-script text-display-2xl font-bold text-amber">
            {copy.line2}
          </span>
          <br />
          {copy.line3}
        </h1>
        <p
          className="stagger-enter mt-4 max-w-md font-sans text-body-lg font-medium text-white/90"
          style={{ '--stagger-delay': '100ms' } as React.CSSProperties}
        >
          {copy.subtext}
        </p>
        <button
          type="button"
          onClick={onCta}
          className={`stagger-enter ${buttonClass({ size: 'md', className: 'mt-6 w-fit' })}`}
          style={{ '--stagger-delay': '200ms' } as React.CSSProperties}
        >
          {copy.cta}
        </button>
      </div>
    </section>
  )
}
