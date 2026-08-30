type ContactHeroProps = {
  title: string
  subtitle: string
  image: string
}

export default function ContactHero({ title, subtitle, image }: ContactHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border-2 border-ink-dark bg-header-brown shadow-[6px_6px_0_#241A12]">
      <div className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:p-12">
        <div className="flex-1">
          <h1 className="font-display text-4xl leading-tight text-card-bg sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl font-sans text-lg font-medium text-card-bg">
            {subtitle}
          </p>
        </div>
        <img
          src={image}
          alt="A juicy smash burger"
          loading="eager"
          className="h-40 w-40 rounded-2xl border-2 border-ink-dark object-cover shadow-[4px_4px_0_#241A12] sm:h-48 sm:w-48"
        />
      </div>
    </section>
  )
}
