import { useNavigate } from 'react-router-dom'
import { logoImg } from '../assets'
import { useStore } from '../context/StoreContext'
import { Clock, MapPin, Phone } from 'lucide-react'

function InstagramIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.5 1.5-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7c4.78-.75 8.44-4.9 8.44-9.9Z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
    </svg>
  )
}

const SOCIALS = [
  { id: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { id: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
  { id: 'facebook', label: 'Facebook', Icon: FacebookIcon },
] as const

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
          <div className="mt-1 flex items-center gap-3">
            {SOCIALS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-card border-2 border-ink-dark bg-[#6B3A1F] text-card-bg shadow-comic transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-ui hover:-translate-y-0.5 hover:bg-accent-red active:translate-y-0 active:shadow-none"
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-4">
          <h3 className="font-display text-xl text-amber uppercase">
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
          <h3 className="font-display text-xl text-amber uppercase">Find Us</h3>
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
