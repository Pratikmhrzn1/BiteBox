import { aboutStory, ctaCopy } from '../data/about'
import AboutStory from '../sections/about/AboutStory'
import Founders from '../sections/about/Founders'
import Locations from '../sections/about/Locations'
import Values from '../sections/about/Values'
import Numbers from '../sections/about/Numbers'
import VibeStrip from '../sections/about/VibeStrip'
import AboutCta from '../sections/about/AboutCta'

type AboutPageProps = {
  onOrderNow: () => void
  onLocationOpen: () => void
}

export default function AboutPage({
  onOrderNow,
  onLocationOpen,
}: AboutPageProps) {
  return (
    <main className="page-container">
      <div className="pb-16">
        <AboutStory story={aboutStory} />

        <Founders />

        <Locations />

        <Values />


        <AboutCta
          cta={ctaCopy}
          onOrderNow={onOrderNow}
          onLocationOpen={onLocationOpen}
        />
      </div>
    </main>
  )
}
