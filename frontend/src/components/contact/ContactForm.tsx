import { useState, type ChangeEvent, type FormEvent } from 'react'
import { sendMessage } from '../../api/contact'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import { fieldClass, focusFirstError } from '../common/formStyles'
import FormField from '../common/FormField'
import { buttonClass } from '../../components/common/Button'
import { Check } from 'lucide-react'

type ContactFormState = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

type FieldErrors = Partial<Record<'name' | 'email' | 'phone' | 'message', string>>

const SUBJECTS = ['General Enquiry', 'Feedback', 'Catering', 'Complaint', 'Other']

const FIELD_ORDER = [
  ['name', 'contact-name'],
  ['email', 'contact-email'],
  ['phone', 'contact-phone'],
  ['message', 'contact-message'],
] as const

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
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(FIELD_ORDER, nextErrors)
      return
    }

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
      <h2 className="font-display text-display-md uppercase text-header-brown">
        Send a Message
      </h2>
      <p className="mt-2 font-sans text-body-lg text-ink-muted">
        Fill this out and we&apos;ll get back to you faster than you can smash a
        patty.
      </p>

      {submitted ? (
        /* Was bg-green-50 / bg-green-600 / text-green-700: a cold stock-green
           panel dropped into a warm comic palette, at the one moment the form
           is celebrating. olive and amber were already in the system.
           header-brown measures 10.93:1 on this ground, white 4.53:1 on the
           olive disc. */
        <div className="mt-8 flex flex-col items-center gap-4 rounded-control border-2 border-ink-dark bg-amber/25 p-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink-dark bg-olive text-white shadow-comic">
            <Check className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="font-display text-display-sm uppercase text-header-brown">
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
          <FormField id="contact-name" label="Full Name" error={errors.name} required>
            {(control) => (
              <input
                {...control}
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={updateField('name')}
                placeholder="Zoe Smashburger"
                className={fieldClass(Boolean(errors.name))}
              />
            )}
          </FormField>

          <FormField
            id="contact-email"
            label="Email Address"
            error={errors.email}
            required
          >
            {(control) => (
              <input
                {...control}
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={updateField('email')}
                placeholder="you@example.com"
                className={fieldClass(Boolean(errors.email))}
              />
            )}
          </FormField>

          <FormField
            id="contact-phone"
            label="Phone Number"
            hint="Optional, if you’d rather we called."
            error={errors.phone}
          >
            {(control) => (
              <input
                {...control}
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={updateField('phone')}
                placeholder="+977 …"
                className={fieldClass(Boolean(errors.phone))}
              />
            )}
          </FormField>

          <FormField id="contact-subject" label="Subject">
            {(control) => (
              <select
                {...control}
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
            )}
          </FormField>

          <FormField
            id="contact-message"
            label="Message"
            error={errors.message}
            required
          >
            {(control) => (
              <textarea
                {...control}
                rows={4}
                value={form.message}
                onChange={updateField('message')}
                placeholder="Tell us everything…"
                className={`${fieldClass(Boolean(errors.message))} resize-none`}
              />
            )}
          </FormField>

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
