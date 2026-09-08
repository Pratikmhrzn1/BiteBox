import { LogOut, ExternalLink } from 'lucide-react'
import { logoImg } from '../../assets'
import { ADMIN_SECTIONS } from './nav'
import type { AdminSection } from './nav'

type SidebarProps = {
  active: AdminSection
  onSelect: (section: AdminSection) => void
  onExit: () => void
  onSignOut: () => void
  adminName: string
  adminEmail: string
  /** Unread counts shown next to the sections that have pending work. */
  badges?: Partial<Record<AdminSection, number>>
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

export default function Sidebar({
  active,
  onSelect,
  onExit,
  onSignOut,
  adminName,
  adminEmail,
  badges = {},
}: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-espresso-black lg:flex">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <img src={logoImg} alt="BiteBox logo" className="h-9 w-auto" />
        <div className="leading-tight">
          <p className="font-display text-display-xs text-amber">BiteBox</p>
          <span className="rounded bg-accent-red px-1.5 py-0.5 font-sans text-[10px] font-bold tracking-widest text-white uppercase">
            Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-2 pb-2 font-sans text-[10px] font-bold tracking-widest text-admin-muted uppercase">
          Manage
        </p>
        <ul className="space-y-1">
          {ADMIN_SECTIONS.map(({ id, label, Icon }) => {
            const isActive = id === active
            const badge = badges[id] ?? 0
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  className={`flex w-full items-center gap-3 rounded-chip border-l-4 px-3 py-2.5 text-left font-sans text-sm font-semibold transition-colors duration-fast ease-ui ${
                    isActive
                      ? 'border-accent-red bg-amber/10 text-amber'
                      : 'border-transparent text-admin-ink hover:bg-white/5 hover:text-cream'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {badge > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-red px-1.5 font-sans text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="space-y-2 border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-red font-sans text-xs font-bold text-white">
            {initials(adminName)}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-sans text-sm font-bold text-cream">
              {adminName}
            </p>
            <p className="truncate font-sans text-xs text-admin-muted">{adminEmail}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="flex w-full items-center gap-2 rounded-chip border border-white/10 px-3 py-2 font-sans text-sm font-semibold text-cream transition-colors duration-fast ease-ui hover:bg-white/5"
        >
          <ExternalLink className="h-4 w-4" /> Exit Admin
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-2 rounded-chip px-3 py-1.5 font-sans text-xs font-semibold text-admin-ink transition-colors duration-fast ease-ui hover:text-accent-red"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
