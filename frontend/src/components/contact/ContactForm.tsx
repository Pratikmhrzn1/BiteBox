import { useState, type ChangeEvent, type FormEvent } from 'react'

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

const SUBJECTS = ['General Enquiry', 'Feedback', 'Catering', 'Complaint', 'Other']

const initialForm: ContactForm = {
  name: '',
  email: '',
  phone: '',
  subject: SUBJECTS[0],
  message: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s-]{7,15}$/

export default function ContactForm() {
  const [form, setForm] = useState<ContactForm>(initialForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

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
    <div className="card-comic rounded-2xl bg-card-bg p-6 sm:p-8">
      <h2 className="font-display text-3xl uppercase text-header-brown">
        Send a Message
      </h2>
      <p className="mt-2 font-sans text-sm text-ink-muted">
        Fill this out and we&apos;ll get back to you faster than you can smash a
        patty.
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
  )
}
