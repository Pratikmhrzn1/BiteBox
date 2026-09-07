import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { buttonClass } from '../components/common/Button'

export default function AdminLoginPage() {
  const { user, isChecking, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isChecking) {
    return (
      <div className="page-container flex min-h-screen items-center justify-center">
        <p className="font-display text-2xl uppercase text-ink-muted">Checking…</p>
      </div>
    )
  }

  if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />
  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const result = await login({ email: email.trim(), password })
      if (result.user.role !== 'ADMIN') {
        setError('This account does not have admin access.')
        return
      }
      navigate('/admin')
    } catch (reason) {
      setError(
        reason instanceof Error
          ? 'Invalid email or password.'
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-container flex min-h-screen items-center justify-center">
      <div className="card-comic w-full max-w-md rounded-card bg-card-bg p-6 sm:p-8">
        <h1 className="font-display text-3xl uppercase text-header-brown">
          Admin Login
        </h1>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          Restricted to BiteBox staff. Please sign in to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block font-sans text-sm font-bold text-ink-dark"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bitebox.com.np"
              className="w-full rounded-control border-2 border-ink-dark bg-white px-4 py-3 font-sans text-sm text-ink-dark placeholder:text-ink-muted"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block font-sans text-sm font-bold text-ink-dark"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-control border-2 border-ink-dark bg-white px-4 py-3 font-sans text-sm text-ink-dark placeholder:text-ink-muted"
            />
          </div>

          {error && (
            <p className="font-sans text-sm font-semibold text-accent-red">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={buttonClass({ size: 'lg', className: 'w-full' })}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}