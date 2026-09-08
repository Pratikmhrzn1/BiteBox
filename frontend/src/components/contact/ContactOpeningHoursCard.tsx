import { Clock } from 'lucide-react'
type ContactOpeningHoursCardProps = {
  label: string
  hours: string
  openNow: boolean
}

export default function ContactOpeningHoursCard({
  label,
  hours,
  openNow,
}: ContactOpeningHoursCardProps) {
  return (
    <div className="rounded-card border-2 border-ink-dark bg-gradient-to-br from-olive-deep to-espresso-dark p-6 text-cream shadow-comic">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 font-display text-display-sm uppercase">
          <Clock className="h-5 w-5 shrink-0" aria-hidden="true" /> {label}
        </h2>
        <span
          className={`flex items-center gap-2 rounded-full border-2 border-ink-dark px-3 py-1 font-sans text-xs font-bold shadow-comic-sm ${
            openNow ? 'bg-olive text-white' : 'bg-accent-red text-white'
          }`}
        >
          {/* Both pill grounds carry white text, so the dot is white on
              either; the state is in the fill and the label, not the dot. */}
          <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />
          {openNow ? 'Open Now' : 'Closed'}
        </span>
      </div>
      <p className="mt-3 font-sans text-sm font-medium text-cream">{hours}</p>
    </div>
  )
}
