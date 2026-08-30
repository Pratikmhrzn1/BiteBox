type AboutCtaProps = {
  title: string
  buttonLabel: string
  onOrderNow: () => void
}

export default function AboutCta({
  title,
  buttonLabel,
  onOrderNow,
}: AboutCtaProps) {
  return (
    <section className="mt-14 rounded-2xl border-2 border-ink-dark bg-espresso-dark p-10 text-center shadow-[6px_6px_0_#241A12] sm:p-14">
      <h2 className="font-display text-4xl uppercase text-cream sm:text-5xl">
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
