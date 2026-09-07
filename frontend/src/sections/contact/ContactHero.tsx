import { unsplashSrcSet } from '../../data/images'
type ContactHeroProps = {
  title: string
  subtitle: string
  image: string
}

export default function ContactHero({ title, subtitle, image }: ContactHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-card border-2 border-ink-dark bg-header-brown shadow-comic-md">
      <div className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:p-12">
        <div className="flex-1">
          <h1 className="font-display text-display-lg text-card-bg">
            {title}
          </h1>
          <p className="mt-4 max-w-xl font-sans text-lg font-medium text-card-bg">
            {subtitle}
          </p>
        </div>
        <img
          src={image}
          srcSet={unsplashSrcSet(image, [160, 240, 320, 480])}
          sizes="12rem"
          alt="A juicy smash burger"
          loading="eager"
          fetchPriority="high"
          className="h-40 w-40 rounded-card border-2 border-ink-dark object-cover shadow-comic sm:h-48 sm:w-48"
        />
      </div>
    </section>
  )
}
