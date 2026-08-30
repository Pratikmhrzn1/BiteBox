type ContactCtaProps = {
  title: string
  buttonLabel: string
  onOrderNow: () => void
}

export default function ContactCta({
  title,
  buttonLabel,
  onOrderNow,
}: ContactCtaProps) {
  return (
    <section className="mt-12 rounded-2xl border-2 border-ink-dark bg-header-brown p-10 text-center shadow-[6px_6px_0_#241A12] sm:p-14">
      <h2 className="font-display text-4xl uppercase text-card-bg sm:text-5xl">
        {title}
      </h2>
      <button
        type="button"
        onClick={onOrderNow}
        className="btn-comic-red mt-8 px-8 py-3.5 text-lg"
      >
        {buttonLabel}
      </button>
    </section>
  )
}
