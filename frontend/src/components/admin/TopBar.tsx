import { useEffect, useState } from 'react'
import { Bell, Clock } from 'lucide-react'

type TopBarProps = {
  title: string
  subtitle: string
  /** Messages and reviews still waiting on someone. */
  pendingCount?: number
  /** Where the bell goes. Without it the bell is not rendered at all. */
  onOpenPending?: () => void
}

function useLiveClock(): string {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function TopBar({
  title,
  subtitle,
  pendingCount = 0,
  onOpenPending,
}: TopBarProps) {
  const clock = useLiveClock()

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-admin-bg/95 px-6 py-5 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-cream">{title}</h1>
          <p className="mt-0.5 font-sans text-sm text-admin-muted">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-chip border border-white/10 bg-admin-field px-3 py-2 nums font-sans text-sm text-amber sm:flex">
            <Clock className="h-4 w-4" />
            {clock}
          </div>
          {/* Was a <div> with a title attribute: a bell with a count badge,
              unfocusable, unclickable and silent to a screen reader. The
              count is messages plus pending reviews, and messages is where
              you act on it. */}
          {onOpenPending && (
            <button
              type="button"
              onClick={onOpenPending}
              aria-label={
                pendingCount === 0
                  ? 'Open messages. Nothing is waiting.'
                  : `Open messages. ${pendingCount} ${
                      pendingCount === 1 ? 'item needs' : 'items need'
                    } attention.`
              }
              className="relative flex h-11 w-11 items-center justify-center rounded-chip border border-white/10 bg-admin-field text-admin-ink transition-[background-color,color,transform] duration-fast ease-ui hover:bg-white/10 hover:text-cream active:scale-[0.96]"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {pendingCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-red px-1 font-sans text-[10px] font-bold text-white"
                  aria-hidden="true"
                >
                  {pendingCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
