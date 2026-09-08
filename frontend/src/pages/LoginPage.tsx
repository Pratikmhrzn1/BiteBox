import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'
import { fieldClass, focusFirstError } from '../components/common/formStyles'
import FormField from '../components/common/FormField'
import { buttonClass } from '../components/common/Button'

type LocationState = { from?: { pathname: string } }
type Errors = Partial<Record<'email' | 'password', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* DOM order, so focusFirstError lands on the field the reader reaches first. */
const FIELD_ORDER = [
  ['email', 'login-email'],
  ['password', 'login-password'],
] as const

export default function LoginPage() {
  const { user, isChecking, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { notify } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isChecking) {
    return (
      <main className="page-container flex min-h-[60vh] items-center justify-center">
        <p className="font-display text-display-sm uppercase text-header-brown">Checking…</p>
      </main>
    )
  }

  if (user) {
    const from = (location.state as LocationState | null)?.from?.pathname
    return <Navigate to={from ?? (user.role === 'ADMIN' ? '/admin' : '/account')} replace />
  }

  /* The form used to post whatever was in the boxes, so an empty submit
     spent a round trip to be told "Invalid credentials". */
  const validate = (): Errors => {
    const next: Errors = {}
    if (!email.trim()) next.email = 'Enter the email you signed up with'
    else if (!EMAIL_RE.test(email.trim())) next.email = 'That email doesn\u2019t look right'
    if (!password) next.password = 'Enter your password'
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
    setError(null)
    try {
      const result = await login({ email: email.trim(), password })
      notify(`Welcome back, ${result.user.name.split(' ')[0]}!`)
      const from = (location.state as LocationState | null)?.from?.pathname
      navigate(from ?? (result.user.role === 'ADMIN' ? '/admin' : '/account'), {
        replace: true,
      })
    } catch (reason) {
      setError(
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
          Welcome Back
        </h1>
        <p className="mt-2 font-sans text-body-lg text-ink-muted">
          Sign in to track your orders and check out faster.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <FormField id="login-email" label="Email" error={errors.email} required>
            {(control) => (
              <input
                {...control}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErrors((current) => ({ ...current, email: undefined }))
                }}
                placeholder="you@example.com"
                className={fieldClass(Boolean(errors.email))}
              />
            )}
          </FormField>

          <FormField
            id="login-password"
            label="Password"
            error={errors.password}
            required
          >
            {(control) => (
              <input
                {...control}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setErrors((current) => ({ ...current, password: undefined }))
                }}
                placeholder="••••••••"
                className={fieldClass(Boolean(errors.password))}
              />
            )}
          </FormField>

          {error && (
            <p className="font-sans text-sm font-semibold text-accent-red" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={buttonClass({ size: 'lg', className: 'w-full' })}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center font-sans text-sm text-ink-muted">
          New here?{' '}
          <Link to="/register" className="font-bold text-accent-red hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
