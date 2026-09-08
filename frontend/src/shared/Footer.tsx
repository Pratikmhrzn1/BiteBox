import { useNavigate } from 'react-router-dom'
import { logoImg } from '../assets'
import SocialLinks from '../components/contact/SocialLinks'
import { useStore } from '../context/StoreContext'
import { Clock, MapPin, Phone } from 'lucide-react'

const footerLinks = [
  { label: 'Home', route: '/' },
  { label: 'Menu', route: '/menu' },
  { label: 'About', route: '/about' },
  { label: 'Contact Us', route: '/contact' },
] as const

export default function Footer() {
  const navigate = useNavigate()
  const { content } = useStore()

  const onNav = (route: string) => navigate(route)

  const onLocationOpen = () => {
    navigate('/')
    window.setTimeout(() => {
      document
        .getElementById('locations')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const hoursSummary = content.openingHours.rows
    .map((row) =>
      row.closed || !row.from || !row.to
        ? `${row.label} Closed`
        : `${row.label} ${row.from} – ${row.to}`,
    )
    .join(' · ')

  const contactRows = [
    { Icon: MapPin, text: content.restaurant.address },
    { Icon: Phone, text: content.restaurant.phone },
    { Icon: Clock, text: hoursSummary },
  ] as const

  return (
    <footer className="border-t-4 border-ink-dark bg-gradient-to-br from-brown to-espresso-dark">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="flex flex-col items-start gap-4">
          <button
            type="button"
            onClick={() => onNav('/')}
            className="flex items-center gap-2"
          >
            <img src={logoImg} alt="BiteBox logo" className="h-10 w-auto" />
            <span className="font-display text-display-sm text-amber">BiteBox</span>
          </button>
          <p className="font-sans text-sm font-medium text-card-bg italic">
            Smashed fresh. Served loud.
          </p>
          {/* Was three <button>s with no onClick: they lifted on hover,
              pressed on click and did nothing. The contact page already had
              working links to the same three accounts. */}
          <div className="mt-1">
            <SocialLinks tone="dark" />
          </div>
        </div>

        <div className="flex flex-col items-start gap-4">
          <h3 className="font-display text-display-xs text-amber uppercase">
            Navigate
          </h3>
          <nav className="flex flex-col gap-2.5">
            {footerLinks.map(({ label, route }) => (
              <button
                key={label}
                type="button"
                onClick={() => onNav(route)}
                className="text-left font-sans text-sm font-semibold text-card-bg transition-colors duration-fast ease-ui hover:text-amber hover:underline hover:underline-offset-4"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div
          id="contact"
          className="flex scroll-mt-24 flex-col items-start gap-4"
        >
          <h3 className="font-display text-display-xs text-amber uppercase">Find Us</h3>
          <ul className="space-y-3">
            {contactRows.map(({ Icon, text }) => (
              <li
                key={text}
                className="flex items-start gap-3 font-sans text-sm font-medium text-card-bg"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onLocationOpen}
            className="mt-2 rounded-full border-2 border-ink-dark bg-amber px-5 py-2.5 font-sans text-sm font-bold text-ink-dark shadow-comic transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-ui hover:-translate-y-0.5 hover:bg-accent-red hover:text-white active:translate-y-0 active:shadow-none"
          >
            Get Directions
          </button>
        </div>
      </div>

      <div className="border-t-2 border-ink-dark/40" />

      <div className="flex flex-col gap-2 bg-ink-dark px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="font-sans text-xs text-card-bg">
          © 2026 BiteBox. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
