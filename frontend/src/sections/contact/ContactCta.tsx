import { buttonClass } from '../../components/common/Button'
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
    <section className="mt-14 rounded-card border-2 border-ink-dark bg-header-brown p-10 text-center shadow-comic-md sm:p-14">
      <h2 className="font-display text-display-lg uppercase text-card-bg">
        {title}
      </h2>
      <button
        type="button"
        onClick={onOrderNow}
        className={buttonClass({ size: 'lg', className: 'mt-8' })}
      >
        {buttonLabel}
      </button>
    </section>
  )
}
