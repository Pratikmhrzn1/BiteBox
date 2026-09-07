import { useState, type ChangeEvent, type FormEvent } from 'react'
import { sendMessage } from '../../api/contact'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import { fieldClass, labelClass } from '../common/formStyles'
import { buttonClass } from '../../components/common/Button'

type ContactFormState = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

type FieldErrors = Partial<Record<'name' | 'email' | 'phone' | 'message', string>>

const SUBJECTS = ['General Enquiry', 'Feedback', 'Catering', 'Complaint', 'Other']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s-]{7,20}$/

export default function ContactForm() {
  const { user } = useAuth()
  const { notify } = useToast()

  const [form, setForm] = useState<ContactFormState>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    subject: SUBJECTS[0],
    message: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const updateField =
    (field: keyof ContactFormState) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
      const { value } = event.target
      setForm((current) => ({ ...current, [field]: value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
    }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!form.name.trim()) next.name = 'Please tell us your name'
    if (!form.email.trim()) next.email = 'We need your email to reply'
    else if (!EMAIL_RE.test(form.email.trim()))
      next.email = 'That email doesn’t look right'
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim()))
      next.phone = 'That phone number looks off'
    if (!form.message.trim()) next.message = 'Drop us a few words'
    return next
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      await sendMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject,
        message: form.message.trim(),
      })
      setSubmitted(true)
      notify('Message sent — we’ll be in touch!')
    } catch (reason) {
      setSubmitError(
        reason instanceof Error
          ? reason.message
          : 'Could not send your message. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      subject: SUBJECTS[0],
      message: '',
    })
    setErrors({})
    setSubmitted(false)
    setSubmitError(null)
  }

  return (
    <div className="card-comic rounded-card bg-card-bg p-6 sm:p-8">
      <h2 className="font-display text-3xl uppercase text-header-brown">
        Send a Message
      </h2>
      <p className="mt-2 font-sans text-sm text-ink-muted">
        Fill this out and we&apos;ll get back to you faster than you can smash a
        patty.
      </p>

      {submitted ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-card border-2 border-ink-dark bg-green-50 p-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-4xl text-white shadow-comic">
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
            className={buttonClass({ size: 'sm', className: 'mt-2' })}
          >
            Send Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Full Name <span className="text-accent-red">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={updateField('name')}
              placeholder="Zoe Smashburger"
              className={fieldClass(Boolean(errors.name))}
            />
            {errors.name && (
              <p className="mt-1.5 font-sans text-xs font-semibold text-accent-red">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email Address <span className="text-accent-red">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="you@example.com"
              className={fieldClass(Boolean(errors.email))}
            />
            {errors.email && (
              <p className="mt-1.5 font-sans text-xs font-semibold text-accent-red">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              Phone Number (optional)
            </label>
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={updateField('phone')}
              placeholder="+977 …"
              className={fieldClass(Boolean(errors.phone))}
            />
            {errors.phone && (
              <p className="mt-1.5 font-sans text-xs font-semibold text-accent-red">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-subject" className={labelClass}>
              Subject
            </label>
            <select
              id="contact-subject"
              value={form.subject}
              onChange={updateField('subject')}
              className={`${fieldClass(false)} cursor-pointer`}
            >
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClass}>
              Message <span className="text-accent-red">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={4}
              value={form.message}
              onChange={updateField('message')}
              placeholder="Tell us everything…"
              className={`${fieldClass(Boolean(errors.message))} resize-none`}
            />
            {errors.message && (
              <p className="mt-1.5 font-sans text-xs font-semibold text-accent-red">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={buttonClass({ size: 'lg', className: 'w-full' })}
          >
            {submitting ? 'Sending…' : 'Send Message'}
          </button>

          {submitError && (
            <p className="font-sans text-sm font-semibold text-accent-red" role="alert">
              {submitError}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
