import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'
import { fieldClass } from '../components/common/formStyles'
import { buttonClass } from '../components/common/Button'

type LocationState = { from?: { pathname: string } }

export default function LoginPage() {
  const { user, isChecking, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { notify } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isChecking) {
    return (
      <main className="page-container flex min-h-[60vh] items-center justify-center">
        <p className="font-display text-2xl uppercase text-header-brown">Checking…</p>
      </main>
    )
  }

  if (user) {
    const from = (location.state as LocationState | null)?.from?.pathname
    return <Navigate to={from ?? (user.role === 'ADMIN' ? '/admin' : '/account')} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
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
        <h1 className="font-display text-3xl uppercase text-header-brown">
          Welcome Back
        </h1>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          Sign in to track your orders and check out faster.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label htmlFor="login-email" className="mb-1.5 block font-sans text-sm font-bold text-ink-dark">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={fieldClass(false)}
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block font-sans text-sm font-bold text-ink-dark">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className={fieldClass(false)}
            />
          </div>

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
