import SocialLinks from './SocialLinks'

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
          <span aria-hidden="true">📞</span> {phone}
        </li>
        <li className="flex items-center gap-2 font-sans text-sm font-semibold text-ink-dark">
          <span aria-hidden="true">📧</span> {email}
        </li>
      </ul>
      <div className="mt-5">
        <SocialLinks />
      </div>
    </div>
  )
}
