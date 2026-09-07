import { useEffect, useState } from 'react'
import { Bell, Clock } from 'lucide-react'

type TopBarProps = {
  title: string
  subtitle: string
  /** Messages and reviews still waiting on someone. */
  pendingCount?: number
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

export default function TopBar({ title, subtitle, pendingCount = 0 }: TopBarProps) {
  const clock = useLiveClock()

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#1F100A]/95 px-6 py-5 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-cream">{title}</h1>
          <p className="mt-0.5 font-sans text-sm text-[#a07c5c]">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-[#2A150A] px-3 py-2 font-mono text-sm text-amber sm:flex">
            <Clock className="h-4 w-4" />
            {clock}
          </div>
          <div
            className="relative rounded-lg border border-white/10 bg-[#2A150A] p-2.5 text-[#c9a583]"
            title={`${pendingCount} item${pendingCount === 1 ? '' : 's'} need attention`}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {pendingCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-red px-1 font-sans text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
