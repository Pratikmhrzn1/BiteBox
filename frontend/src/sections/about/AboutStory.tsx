import { unsplashSrcSet } from '../../data/images'
import type { AboutStoryData } from '../../data/about'

type AboutStoryProps = {
  story: AboutStoryData
}

export default function AboutStory({ story }: AboutStoryProps) {
  return (
    <section className="mt-14 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
      <div>
        <p className="font-sans text-sm font-bold uppercase tracking-wide text-accent-red">
          {story.label}
        </p>
        <h2 className="mt-2 font-display text-display-lg text-header-brown">
          {story.heading}
        </h2>
        <div className="mt-5 space-y-4">
          {story.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="max-w-xl font-sans text-body-lg leading-relaxed text-ink-dark"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="group overflow-hidden rounded-card border-2 border-ink-dark shadow-comic-md">
        <img
          src={story.image}
          srcSet={unsplashSrcSet(story.image)}
          sizes="(min-width: 768px) 34rem, 92vw"
          alt="Inside the BiteBox kitchen"
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] h-full w-full object-cover transition-transform duration-slow ease-ui group-hover:scale-105"
        />
      </div>
    </section>
  )
}
