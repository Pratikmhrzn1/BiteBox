import { aboutHero, storyCopy, storyImage, whyWeSmash, team, ctaCopy } from '../data/about'
import SectionHeading from '../components/SectionHeading'

type AboutPageProps = {
  onOrderNow: () => void
}

export default function AboutPage({ onOrderNow }: AboutPageProps) {
  return (
    <main className="page-container">
    <div className="pb-16">
      <section className="relative flex min-h-[22rem] items-center overflow-hidden rounded-2xl sm:min-h-[26rem]">
        <img
          src={aboutHero.image}
          alt="Moody burger kitchen"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-dark/85 via-ink-dark/70 to-ink-dark/40" />

        <div className="relative z-10 flex max-w-2xl flex-col gap-2 p-8 sm:p-12 lg:p-16">
          <h1 className="font-display text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
            {aboutHero.title}
          </h1>
          <p className="font-script text-3xl text-amber sm:text-4xl">
            {aboutHero.subtitle}
          </p>
        </div>
      </section>

      <section className="mt-14 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div>
          <SectionHeading>Our Story</SectionHeading>
          <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-ink-dark">
            {storyCopy}
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border-2 border-ink-dark shadow-[6px_6px_0_#241A12]">
          <img
            src={storyImage}
            alt="Inside the BiteBox kitchen"
            loading="lazy"
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading>Why We Smash</SectionHeading>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {whyWeSmash.map((feature) => (
            <div
              key={feature.id}
              className="card-comic rounded-2xl p-6"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink-dark bg-amber text-2xl shadow-[3px_3px_0_#241A12]">
                {feature.emoji}
              </span>
              <h3 className="mt-4 font-display text-xl uppercase text-header-brown">
                {feature.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading>Meet the Team</SectionHeading>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.id}
              className="card-comic overflow-hidden rounded-2xl"
            >
              <div className="aspect-square overflow-hidden border-b-2 border-ink-dark">
                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-sans text-lg font-bold text-ink-dark">
                  {member.name}
                </h3>
                <p className="mt-0.5 font-sans text-sm font-semibold text-accent-red">
                  {member.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border-2 border-ink-dark bg-espresso-dark p-10 text-center shadow-[6px_6px_0_#241A12] sm:p-14">
        <h2 className="font-display text-4xl uppercase text-cream sm:text-5xl">
          {ctaCopy.title}
        </h2>
        <button
          type="button"
          onClick={onOrderNow}
          className="btn-comic-red mt-8 px-8 py-3.5 text-lg"
        >
          {ctaCopy.buttonLabel}
        </button>
      </section>
    </div>
    </main>
  )
}