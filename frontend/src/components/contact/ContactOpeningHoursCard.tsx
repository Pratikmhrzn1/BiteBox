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
          <span aria-hidden="true">🕐</span> {label}
        </h2>
        <span
          className={`flex items-center gap-2 rounded-full border-2 border-ink-dark px-3 py-1 font-sans text-xs font-bold shadow-comic-sm ${
            openNow ? 'bg-green-400 text-ink-dark' : 'bg-accent-red text-white'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              openNow ? 'bg-green-700' : 'bg-white'
            }`}
          />
          {openNow ? 'Open Now' : 'Closed'}
        </span>
      </div>
      <p className="mt-3 font-sans text-sm font-medium text-cream">{hours}</p>
    </div>
  )
}
