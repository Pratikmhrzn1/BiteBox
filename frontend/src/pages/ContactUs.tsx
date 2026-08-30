import { unsplash } from '../data/images'
import ContactHero from '../sections/contact/ContactHero'
import ContactInfo from '../sections/contact/ContactInfo'
import ContactCta from '../sections/contact/ContactCta'

type ContactPageProps = {
  onNav: (route: string) => void
  onLocationOpen: () => void
}

const HERO_IMG = unsplash('photo-1568901346375-23c9450c58cd', 600, 70)

const CONTACT = {
  address: 'Nakhipot, Lalitpur, Nepal',
  mapEmbedUrl:
    'https://maps.google.com/maps?q=Nakhipot%20Lalitpur&ll=27.6551,85.3157&z=16&output=embed',
  phone: '+977 9800000000',
  email: 'hello@bitebox.com.np',
  hoursLabel: "We're Open",
  hours: 'Mon–Sun: 11:30 AM – 10:00 PM',
}

function isOpenNow(): boolean {
  const now = new Date()
  const total = now.getHours() * 60 + now.getMinutes()
  const open = 11 * 60 + 30
  const close = 22 * 60
  return total >= open && total < close
}

export function ContactUs({ onNav, onLocationOpen }: ContactPageProps) {
  return (
    <main className="page-container">
      <ContactHero
        title="Let's Talk Smash."
        subtitle="Questions, feedback, catering requests — we're all ears (and all patties)."
        image={HERO_IMG}
      />

      <ContactInfo
        address={CONTACT.address}
        mapEmbedUrl={CONTACT.mapEmbedUrl}
        phone={CONTACT.phone}
        email={CONTACT.email}
        hoursLabel={CONTACT.hoursLabel}
        hours={CONTACT.hours}
        openNow={isOpenNow()}
        onDirections={onLocationOpen}
      />

      <ContactCta
        title="Hungry right now?"
        buttonLabel="Order Now"
        onOrderNow={() => onNav('menu')}
      />
    </main>
  )
}
