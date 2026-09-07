import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'

/** Grey placeholder cards shown while the menu is in flight. */
export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="card-comic overflow-hidden rounded-xl bg-card-bg"
        >
          <div className="aspect-[4/3] animate-pulse bg-ink-muted/20" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-ink-muted/20" />
            <div className="h-3 w-full animate-pulse rounded bg-ink-muted/15" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-ink-muted/15" />
          </div>
        </div>
      ))}
    </div>
  )
}

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
    <div className="card-comic mt-8 flex flex-col items-center gap-3 rounded-2xl bg-card-bg p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink-dark bg-accent-red">
        <AlertTriangle className="h-6 w-6 text-white" aria-hidden="true" />
      </span>
      <p className="font-display text-2xl uppercase text-header-brown">
        Something went wrong
      </p>
      <p className="max-w-md font-sans text-sm text-ink-muted">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-comic-red mt-2 px-6 py-2.5">
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
      <p className="font-display text-2xl uppercase text-header-brown">{title}</p>
      {hint && <p className="max-w-md font-sans text-sm text-ink-muted">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
