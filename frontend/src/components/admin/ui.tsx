/* eslint-disable react-refresh/only-export-components */
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export const cardClass =
  'rounded-2xl border border-white/5 bg-admin-surface'

export const inputClass =
  'w-full rounded-lg border border-white/10 bg-admin-field px-3 py-2 font-sans text-sm text-cream placeholder:text-admin-muted focus:border-accent-red'

export const labelClass =
  'mb-1.5 block font-sans text-xs font-bold uppercase tracking-wider text-amber'

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-accent-red px-4 py-2 font-sans text-sm font-bold text-white transition hover:bg-red-700'

export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2 font-sans text-sm font-semibold text-cream transition hover:bg-white/5'

export const btnDanger =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2 font-sans text-sm font-bold text-white transition hover:bg-red-600'

export const btnToggle = (active: boolean): string =>
  `rounded-lg px-3 py-1.5 font-sans text-sm font-bold transition ${
    active
      ? 'bg-accent-red text-white'
      : 'border border-white/15 text-admin-ink hover:bg-white/5'
  }`

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  )
}

export function PanelCard({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className={`${cardClass} p-5`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-sans text-sm font-bold tracking-widest text-amber uppercase">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  )
}

export function Modal({
  title,
  onClose,
  children,
  footer,
  width = 'max-w-lg',
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  width?: string
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`${cardClass} w-full ${width} max-h-[90vh] overflow-hidden`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <h3 className="font-sans text-base font-bold tracking-wide text-cream uppercase">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-admin-ink transition hover:bg-white/10 hover:text-cream"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[calc(90vh-7rem)] overflow-y-auto px-5 py-4">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-white/5 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function EmptyState({
  title,
  hint,
}: {
  title: string
  hint?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-12 text-center">
      <p className="font-sans text-sm font-bold text-cream">{title}</p>
      {hint && (
        <p className="font-sans text-xs text-admin-muted">{hint}</p>
      )}
    </div>
  )
}