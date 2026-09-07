import { unsplashSrcSet } from '../../data/images'
type AboutHeroProps = {
  image: string
  title: string
  subtitle: string
}

export default function AboutHero({ image, title, subtitle }: AboutHeroProps) {
  return (
    <section className="relative flex min-h-[22rem] items-center overflow-hidden rounded-card sm:min-h-[26rem]">
      <img
        src={image}
        srcSet={unsplashSrcSet(image)}
        sizes="100vw"
        alt="Moody burger kitchen"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink-dark/85 via-ink-dark/70 to-ink-dark/40" />

      <div className="relative z-10 flex max-w-2xl flex-col gap-2 p-8 sm:p-12 lg:p-16">
        <h1 className="font-display text-display-lg text-cream">
          {title}
        </h1>
        <p className="font-script text-3xl text-amber sm:text-4xl">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
