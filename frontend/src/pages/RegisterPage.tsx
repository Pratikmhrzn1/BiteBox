import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'
import { fieldClass, focusFirstError } from '../components/common/formStyles'
import FormField from '../components/common/FormField'
import { buttonClass } from '../components/common/Button'

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'password', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s-]{7,15}$/

export default function RegisterPage() {
  const { user, isChecking, register } = useAuth()
  const navigate = useNavigate()
  const { notify } = useToast()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isChecking) {
    return (
      <main className="page-container flex min-h-[60vh] items-center justify-center">
        <p className="font-display text-display-sm uppercase text-header-brown">Checking…</p>
      </main>
    )
  }

  if (user) return <Navigate to="/account" replace />

  const fields = [
    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Zoe Smashburger', required: true, autoComplete: 'name' },
    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', required: true, autoComplete: 'email' },
    { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+977 …', required: false, hint: 'Optional. Used only for order updates.', autoComplete: 'tel' },
    { id: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters', required: true, autoComplete: 'new-password' },
  ] as const

  const update = (field: keyof typeof form) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = (): Errors => {
    const next: Errors = {}
    if (!form.name.trim()) next.name = 'Please tell us your name'
    if (!form.email.trim()) next.email = 'We need your email to sign you in'
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'That email doesn’t look right'
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim()))
      next.phone = 'That phone number looks off'
    if (form.password.length < 6) next.password = 'Use at least 6 characters'
    return next
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(
        fields.map((field) => [field.id, `register-${field.id}`] as const),
        nextErrors,
      )
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      })
      notify('Account created — welcome to BiteBox!')
      navigate('/account', { replace: true })
    } catch (reason) {
      setSubmitError(
        reason instanceof Error ? reason.message : 'Something went wrong. Try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <main className="page-container flex min-h-[70vh] items-center justify-center">
      <div className="card-comic w-full max-w-md rounded-card bg-card-bg p-6 sm:p-8">
        <h1 className="font-display text-display-md uppercase text-header-brown">
          Join BiteBox
        </h1>
        <p className="mt-2 font-sans text-body-lg text-ink-muted">
          Save your details, track orders and reorder in one tap.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          {fields.map((field) => (
            <FormField
              key={field.id}
              id={`register-${field.id}`}
              label={field.label}
              error={errors[field.id]}
              hint={'hint' in field ? field.hint : undefined}
              required={field.required}
            >
              {(control) => (
                <input
                  {...control}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  value={form[field.id]}
                  onChange={(event) => update(field.id)(event.target.value)}
                  placeholder={field.placeholder}
                  className={fieldClass(Boolean(errors[field.id]))}
                />
              )}
            </FormField>
          ))}

          {submitError && (
            <p className="font-sans text-sm font-semibold text-accent-red" role="alert">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={buttonClass({ size: 'lg', className: 'w-full' })}
          >
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center font-sans text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-accent-red hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
