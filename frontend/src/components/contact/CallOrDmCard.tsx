import SocialLinks from './SocialLinks'
import { Mail, Phone } from 'lucide-react'

type CallOrDmCardProps = {
  phone: string
  email: string
}

export default function CallOrDmCard({ phone, email }: CallOrDmCardProps) {
  return (
    <div className="rounded-card border-2 border-ink-dark bg-amber p-6 shadow-comic">
      <h2 className="font-display text-display-sm uppercase text-header-brown">
        Call or DM
      </h2>
      <ul className="mt-3 space-y-2">
        <li className="flex items-center gap-2 font-sans text-sm font-semibold text-ink-dark">
          <Phone className="h-4 w-4 shrink-0" aria-hidden="true" /> {phone}
        </li>
        <li className="flex items-center gap-2 font-sans text-sm font-semibold text-ink-dark">
          <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> {email}
        </li>
      </ul>
      <div className="mt-5">
        <SocialLinks />
      </div>
    </div>
  )
}
