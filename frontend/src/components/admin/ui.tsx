/* eslint-disable react-refresh/only-export-components */
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export const cardClass =
  'rounded-card border border-white/5 bg-admin-surface'

export const inputClass =
  'w-full rounded-chip border border-white/10 bg-admin-field px-3 py-2 font-sans text-sm text-cream placeholder:text-admin-muted focus:border-accent-red'

export const labelClass =
  'mb-1.5 block font-sans text-xs font-bold uppercase tracking-wider text-amber'

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-chip bg-accent-red px-4 py-2 font-sans text-sm font-bold text-white transition-colors duration-fast ease-ui hover:bg-red-700'

export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-chip border border-white/15 px-4 py-2 font-sans text-sm font-semibold text-cream transition-colors duration-fast ease-ui hover:bg-white/5'

export const btnDanger =
  'inline-flex items-center justify-center gap-2 rounded-chip bg-red-700 px-4 py-2 font-sans text-sm font-bold text-white transition-colors duration-fast ease-ui hover:bg-red-600'

export const btnToggle = (active: boolean): string =>
  `rounded-chip px-3 py-1.5 font-sans text-sm font-bold transition-colors duration-fast ease-ui active:scale-[0.96] ${
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
  className = '',
}: {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`${cardClass} p-5 ${className}`}>
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
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  // onClose arrives as an inline arrow, so it is read through a ref to keep
  // the effect below mount-only.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  // The storefront's dialogs close on Escape and manage focus; this one did
  // neither, so an admin could only dismiss it by clicking the backdrop.
  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      returnFocusRef.current?.focus()
    }
    // Mount and unmount only, for the same reason as the storefront dialog.
  }, [])

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`${cardClass} animate-pop-in w-full ${width} max-h-[90vh] overflow-hidden`}
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
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-chip text-admin-ink transition-[background-color,color,transform] duration-fast ease-ui hover:bg-white/10 hover:text-cream active:scale-[0.96]"
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