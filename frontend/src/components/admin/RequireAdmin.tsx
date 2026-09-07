import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'

type RequireAdminProps = {
  children?: ReactNode
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { user, isChecking } = useAuth()
  const location = useLocation()

  if (isChecking) {
    return (
      <div className="page-container flex min-h-screen items-center justify-center">
        <p className="font-display text-2xl uppercase text-ink-muted">Checking…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return children ? <>{children}</> : <Outlet />
}