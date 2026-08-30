import { useState, type ChangeEvent, type FormEvent } from 'react'
import { unsplash } from '../data/images'

type ContactForm = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

type FieldErrors = {
  name?: string
  email?: string
  phone?: string
  message?: string
}

type ContactPageProps = {
  onNav: (route: string) => void
  onLocationOpen: () => void
}

const SUBJECTS = ['General Enquiry', 'Feedback', 'Catering', 'Complaint', 'Other']

const BURGER_IMG = unsplash('photo-1568901346375-23c9450c58cd', 600, 70)

const initialForm: ContactForm = {
  name: '',
  email: '',
  phone: '',
  subject: SUBJECTS[0],
  message: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s-]{7,15}$/

function isOpenNow(): boolean {
  const now = new Date()
  const hour = now.getHours()
  const minutes = now.getMinutes()
  const total = hour * 60 + minutes
  const open = 11 * 60 + 30
  const close = 22 * 60
  return total >= open && total < close
}

export function ContactUs({ onNav, onLocationOpen }: ContactPageProps) {
  const [form, setForm] = useState<ContactForm>(initialForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const openNow = isOpenNow()

  const updateField = (field: keyof ContactForm) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!form.name.trim()) next.name = 'Please tell us your name'
    if (!form.email.trim()) {
      next.email = 'We need your email to reply'
    } else if (!EMAIL_RE.test(form.email.trim())) {
      next.email = 'That email doesn’t look right'
    }
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) {
      next.phone = 'That phone number looks off'
    }
    if (!form.message.trim()) next.message = 'Drop us a few words'
    return next
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSubmitted(true)
  }

  const resetForm = () => {
    setForm(initialForm)
    setErrors({})
    setSubmitted(false)
  }

  const inputClasses = (hasError: boolean) =>
    `w-full rounded-xl border-2 bg-white px-4 py-3 font-sans text-sm text-ink-dark placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-amber ${
      hasError ? 'border-accent-red' : 'border-ink-dark'
    }`

  return (
    <main className="page-container">
      {/* Hero banner */}
      <section className="relative overflow-hidden rounded-2xl border-2 border-ink-dark bg-header-brown shadow-[6px_6px_0_#241A12]">
        <div className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:p-12">
          <div className="flex-1">
            <h1 className="font-display text-4xl leading-tight text-card-bg sm:text-5xl lg:text-6xl">
              Let&apos;s Talk Smash.
            </h1>
            <p className="mt-4 max-w-xl font-sans text-lg font-medium text-card-bg">
              Questions, feedback, catering requests — we&apos;re all ears (and
              all patties).
            </p>
          </div>
          <img
            src={BURGER_IMG}
            alt="A juicy smash burger"
            loading="eager"
            className="h-40 w-40 rounded-2xl border-2 border-ink-dark object-cover shadow-[4px_4px_0_#241A12] sm:h-48 sm:w-48"
          />
        </div>
      </section>

      {/* Two-column layout */}
      <section className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Form card */}
        <div className="card-comic rounded-2xl bg-card-bg p-6 sm:p-8">
          <h2 className="font-display text-3xl uppercase text-header-brown">
            Send a Message
          </h2>
          <p className="mt-2 font-sans text-sm text-ink-muted">
            Fill this out and we&apos;ll get back to you faster than you can
            smash a patty.
          </p>

          {submitted ? (
            <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border-2 border-ink-dark bg-green-50 p-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-4xl text-white shadow-[4px_4px_0_#241A12]">
                ✓
              </span>
              <p className="font-display text-2xl uppercase text-green-700">
                We got your message!
              </p>
              <p className="font-sans text-sm text-ink-dark">
                Expect a reply within 24 hours.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="btn-comic-red mt-2 px-6 py-2.5 text-sm"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block font-sans text-sm font-bold text-ink-dark"
                >
                  Full Name <span className="text-accent-red">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={updateField('name')}
                  placeholder="Zoe Smashburger"
                  className={inputClasses(Boolean(errors.name))}
                />
                {errors.name && (
                  <p className="mt-1.5 font-sans text-xs font-semibold text-accent-red">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block font-sans text-sm font-bold text-ink-dark"
                >
                  Email Address <span className="text-accent-red">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                  placeholder="you@example.com"
                  className={inputClasses(Boolean(errors.email))}
                />
                {errors.email && (
                  <p className="mt-1.5 font-sans text-xs font-semibold text-accent-red">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="mb-1.5 block font-sans text-sm font-bold text-ink-dark"
                >
                  Phone Number (optional)
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField('phone')}
                  placeholder="+977 …"
                  className={inputClasses(Boolean(errors.phone))}
                />
                {errors.phone && (
                  <p className="mt-1.5 font-sans text-xs font-semibold text-accent-red">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-1.5 block font-sans text-sm font-bold text-ink-dark"
                >
                  Subject
                </label>
                <select
                  id="contact-subject"
                  value={form.subject}
                  onChange={updateField('subject')}
                  className={`${inputClasses(false)} cursor-pointer`}
                >
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block font-sans text-sm font-bold text-ink-dark"
                >
                  Message <span className="text-accent-red">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={form.message}
                  onChange={updateField('message')}
                  placeholder="Tell us everything…"
                  className={`${inputClasses(Boolean(errors.message))} resize-none`}
                />
                {errors.message && (
                  <p className="mt-1.5 font-sans text-xs font-semibold text-accent-red">
                    {errors.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-comic-red w-full py-4 text-lg">
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Info cards */}
        <div className="flex flex-col gap-6">
          {/* Visit Us */}
          <div className="rounded-2xl border-2 border-ink-dark bg-header-brown p-6 shadow-[4px_4px_0_#241A12]">
            <h2 className="flex items-center gap-2 font-display text-2xl uppercase text-amber">
              <span aria-hidden="true">📍</span> Visit Us
            </h2>
            <p className="mt-3 font-sans text-sm font-medium text-card-bg">
              Nakhipot, Lalitpur, Nepal
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border-2 border-ink-dark">
              <iframe
                title="BiteBox location map"
                src="https://maps.google.com/maps?q=Nakhipot%20Lalitpur&ll=27.6551,85.3157&z=16&output=embed"
                className="h-40 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <button
              type="button"
              onClick={onLocationOpen}
              className="mt-4 rounded-full border-2 border-ink-dark bg-amber px-5 py-2.5 font-sans text-sm font-bold text-ink-dark shadow-[4px_4px_0_#241A12] transition hover:-translate-y-0.5 hover:bg-accent-red hover:text-white active:translate-y-0 active:shadow-none"
            >
              Get Directions
            </button>
          </div>

          {/* Call or DM */}
          <div className="rounded-2xl border-2 border-ink-dark bg-amber p-6 shadow-[4px_4px_0_#241A12]">
            <h2 className="font-display text-2xl uppercase text-header-brown">
              Call or DM
            </h2>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center gap-2 font-sans text-sm font-semibold text-ink-dark">
                <span aria-hidden="true">📞</span> +977 9800000000
              </li>
              <li className="flex items-center gap-2 font-sans text-sm font-semibold text-ink-dark">
                <span aria-hidden="true">📧</span> hello@bitebox.com.np
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink-dark bg-card-bg text-ink-dark shadow-[4px_4px_0_#241A12] transition hover:-translate-y-0.5 hover:bg-accent-red hover:text-white active:translate-y-0 active:shadow-none"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink-dark bg-card-bg text-ink-dark shadow-[4px_4px_0_#241A12] transition hover:-translate-y-0.5 hover:bg-accent-red hover:text-white active:translate-y-0 active:shadow-none"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink-dark bg-card-bg text-ink-dark shadow-[4px_4px_0_#241A12] transition hover:-translate-y-0.5 hover:bg-accent-red hover:text-white active:translate-y-0 active:shadow-none"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.5 1.5-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7c4.78-.75 8.44-4.9 8.44-9.9Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="rounded-2xl border-2 border-ink-dark bg-gradient-to-br from-olive to-espresso-dark p-6 text-cream shadow-[4px_4px_0_#241A12]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 font-display text-2xl uppercase">
                <span aria-hidden="true">🕐</span> We&apos;re Open
              </h2>
              <span
                className={`flex items-center gap-2 rounded-full border-2 border-ink-dark px-3 py-1 font-sans text-xs font-bold shadow-[3px_3px_0_#241A12] ${
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
            <p className="mt-3 font-sans text-sm font-medium text-cream">
              Mon–Sun: 11:30 AM – 10:00 PM
            </p>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="mt-12 rounded-2xl border-2 border-ink-dark bg-header-brown p-10 text-center shadow-[6px_6px_0_#241A12] sm:p-14">
        <h2 className="font-display text-4xl uppercase text-card-bg sm:text-5xl">
          Hungry right now?
        </h2>
        <button
          type="button"
          onClick={() => onNav('menu')}
          className="btn-comic-red mt-8 px-8 py-3.5 text-lg"
        >
          Order Now
        </button>
      </section>
    </main>
  )
}
