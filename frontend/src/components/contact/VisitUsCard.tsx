type VisitUsCardProps = {
  address: string
  mapEmbedUrl: string
  onDirections: () => void
}

export default function VisitUsCard({
  address,
  mapEmbedUrl,
  onDirections,
}: VisitUsCardProps) {
  return (
    <div className="rounded-card border-2 border-ink-dark bg-header-brown p-6 shadow-comic">
      <h2 className="flex items-center gap-2 font-display text-display-sm uppercase text-amber">
        <span aria-hidden="true">📍</span> Visit Us
      </h2>
      <p className="mt-3 font-sans text-sm font-medium text-card-bg">
        {address}
      </p>
      <div className="mt-4 overflow-hidden rounded-control border-2 border-ink-dark">
        <iframe
          title="BiteBox location map"
          src={mapEmbedUrl}
          className="h-40 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <button
        type="button"
        onClick={onDirections}
        className="mt-4 rounded-full border-2 border-ink-dark bg-amber px-5 py-2.5 font-sans text-sm font-bold text-ink-dark shadow-comic transition hover:-translate-y-0.5 hover:bg-accent-red hover:text-white active:translate-y-0 active:shadow-none"
      >
        Get Directions
      </button>
    </div>
  )
}
