import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { buttonClass } from './Button'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <RefreshCw className="h-7 w-7 animate-spin text-accent-red" aria-hidden="true" />
      <p className="font-sans text-sm font-bold text-ink-muted">{label}</p>
    </div>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="card-comic mt-8 flex flex-col items-center gap-3 rounded-card bg-card-bg p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink-dark bg-accent-red">
        <AlertTriangle className="h-6 w-6 text-white" aria-hidden="true" />
      </span>
      <p className="font-display text-display-sm uppercase text-header-brown">
        Something went wrong
      </p>
      <p className="max-w-md font-sans text-sm text-ink-muted">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={buttonClass({ size: 'sm', className: 'mt-2' })}>
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string
  hint?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="font-display text-display-sm uppercase text-header-brown">{title}</p>
      {hint && <p className="max-w-md font-sans text-sm text-ink-muted">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
