import ContactForm from '../../components/contact/ContactForm'
import VisitUsCard from '../../components/contact/VisitUsCard'
import CallOrDmCard from '../../components/contact/CallOrDmCard'
import ContactOpeningHoursCard from '../../components/contact/ContactOpeningHoursCard'

type ContactInfoProps = {
  address: string
  mapEmbedUrl: string
  phone: string
  email: string
  hoursLabel: string
  hours: string
  openNow: boolean
  onDirections: () => void
}

export default function ContactInfo({
  address,
  mapEmbedUrl,
  phone,
  email,
  hoursLabel,
  hours,
  openNow,
  onDirections,
}: ContactInfoProps) {
  return (
    <section className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
      <ContactForm />

      <div className="flex flex-col gap-6">
        <VisitUsCard
          address={address}
          mapEmbedUrl={mapEmbedUrl}
          onDirections={onDirections}
        />
        <CallOrDmCard phone={phone} email={email} />
        <ContactOpeningHoursCard
          label={hoursLabel}
          hours={hours}
          openNow={openNow}
        />
      </div>
    </section>
  )
}
