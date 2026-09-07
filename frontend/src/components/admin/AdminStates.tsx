import { AlertTriangle, RefreshCw } from 'lucide-react'

/** Dark-theme loading/error blocks matching the admin panel's palette. */
export function AdminLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <RefreshCw className="h-6 w-6 animate-spin text-amber" aria-hidden="true" />
      <p className="font-sans text-sm font-semibold text-admin-muted">{label}</p>
    </div>
  )
}

export function AdminError({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-red-500/30 bg-[#3a1410] py-12 text-center">
      <AlertTriangle className="h-6 w-6 text-red-300" aria-hidden="true" />
      <p className="font-sans text-sm font-bold text-red-200">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-chip border border-white/20 px-4 py-2 font-sans text-sm font-bold text-cream transition hover:bg-white/10"
        >
          Retry
        </button>
      )}
    </div>
  )
}
