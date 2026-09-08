import { unsplashSrcSet } from '../../data/images'
import type { AboutStoryData } from '../../data/about'

type AboutStoryProps = {
  story: AboutStoryData
}

/* This section opens the page now that the hero band is gone, so it carries
 * the h1 and the one orchestrated page-load sequence: note, headline, story,
 * photograph. Everything below it still arrives on scroll. */
export default function AboutStory({ story }: AboutStoryProps) {
  return (
    <section className="grid grid-cols-1 items-center gap-10 pt-4 md:grid-cols-2 lg:pt-8">
      <div>
        <p
          className="stagger-enter font-script text-2xl font-bold text-accent-red"
          style={{ '--stagger-delay': '0ms' } as React.CSSProperties}
        >
          {story.label}
        </p>
        <h1
          className="stagger-enter mt-2 font-display text-display-xl text-header-brown"
          style={{ '--stagger-delay': '80ms' } as React.CSSProperties}
        >
          {story.heading}
        </h1>
        <div
          className="stagger-enter mt-5 space-y-4"
          style={{ '--stagger-delay': '180ms' } as React.CSSProperties}
        >
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

      {/* The entrance sits on a wrapper rather than on the card itself:
          stagger-enter fills forwards, which would pin the card's transform
          at animation priority and silently outrank its hover lift. */}
      <div
        className="stagger-enter"
        style={{ '--stagger-delay': '280ms' } as React.CSSProperties}
      >
        <div className="group overflow-hidden rounded-card border-2 border-ink-dark shadow-comic-md transition-[transform,box-shadow] duration-base ease-ui hover:-translate-y-1 hover:shadow-comic-lg">
          <img
            src={story.image}
            srcSet={unsplashSrcSet(story.image)}
            sizes="(min-width: 768px) 34rem, 92vw"
            alt="Inside the BiteBox kitchen"
            className="aspect-[4/3] h-full w-full object-cover transition-transform duration-slower ease-ui group-hover:scale-105"
          />
        </div>
      </div>
    </section>
  )
}
