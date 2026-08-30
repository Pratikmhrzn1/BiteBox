import { aboutHero, storyCopy, storyImage, whyWeSmash, team, ctaCopy } from '../data/about'
import AboutHero from '../sections/about/AboutHero'
import AboutStory from '../sections/about/AboutStory'
import WhyWeSmash from '../sections/about/WhyWeSmash'
import MeetTheTeam from '../sections/about/MeetTheTeam'
import AboutCta from '../sections/about/AboutCta'

type AboutPageProps = {
  onOrderNow: () => void
}

export default function AboutPage({ onOrderNow }: AboutPageProps) {
  return (
    <main className="page-container">
      <div className="pb-16">
        <AboutHero
          image={aboutHero.image}
          title={aboutHero.title}
          subtitle={aboutHero.subtitle}
        />

        <AboutStory storyCopy={storyCopy} storyImage={storyImage} />

        <WhyWeSmash features={whyWeSmash} />

        <MeetTheTeam members={team} />

        <AboutCta
          title={ctaCopy.title}
          buttonLabel={ctaCopy.buttonLabel}
          onOrderNow={onOrderNow}
        />
      </div>
    </main>
  )
}
