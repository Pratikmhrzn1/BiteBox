import { useNavigate } from 'react-router-dom'
import { unsplash } from '../data/images'
import ContactHero from '../sections/contact/ContactHero'
import ContactInfo from '../sections/contact/ContactInfo'
import ContactCta from '../sections/contact/ContactCta'
import { useStore } from '../context/StoreContext'

const HERO_IMG = unsplash('photo-1568901346375-23c9450c58cd', 600, 70)

/** Compares against the first opening-hours row, which covers the common case. */
function isOpenNow(): boolean {
  const now = new Date()
  const minutes = now.getHours() * 60 + now.getMinutes()
  return minutes >= 11 * 60 + 30 && minutes < 22 * 60
}

export function ContactUs() {
  const navigate = useNavigate()
  const { content } = useStore()
  const { restaurant } = content

  const scrollToLocations = () => {
    navigate('/')
    window.setTimeout(() => {
      document
        .getElementById('locations')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <main className="page-container">
      <ContactHero
        title="Let's Talk Smash."
        subtitle="Questions, feedback, catering requests — we're all ears (and all patties)."
        image={HERO_IMG}
      />

      <ContactInfo
        address={restaurant.address}
        mapEmbedUrl={restaurant.mapEmbedUrl}
        phone={restaurant.phone}
        email={restaurant.email}
        hoursLabel={restaurant.hoursLabel}
        hours={restaurant.hours}
        openNow={isOpenNow()}
        onDirections={scrollToLocations}
      />

      <ContactCta
        title="Hungry right now?"
        buttonLabel="Order Now"
        onOrderNow={() => navigate('/menu')}
      />
    </main>
  )
}
