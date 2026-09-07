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
        alt="Moody burger kitchen"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink-dark/85 via-ink-dark/70 to-ink-dark/40" />

      <div className="relative z-10 flex max-w-2xl flex-col gap-2 p-8 sm:p-12 lg:p-16">
        <h1 className="font-display text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="font-script text-3xl text-amber sm:text-4xl">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
