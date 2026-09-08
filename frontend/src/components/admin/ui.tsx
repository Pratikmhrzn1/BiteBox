/* eslint-disable react-refresh/only-export-components */
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'

/* border-white/10 was 5% on a near-black ground: the cards had no perceptible
 * edge at all. /10 is the point the edge becomes visible without turning into
 * a rule. */
export const cardClass =
  'rounded-card border border-white/10 bg-admin-surface'

export const inputClass =
  'w-full rounded-chip border border-white/10 bg-admin-field px-3 py-2 font-sans text-sm text-cream placeholder:text-admin-muted focus:border-accent-red'

export const labelClass =
  'mb-1.5 block font-sans text-xs font-bold uppercase tracking-wider text-amber'

/* Sizing note. The storefront holds every control to 44px because it is
 * thumb-first. The admin panel is a desktop tool whose buttons sit inline in
 * data tables, where 44px rows would halve how many orders fit on screen, so
 * inline controls take 36px - comfortably over the 24px WCAG 2.5.8 floor -
 * and standalone or touch controls take the full 44px. Before this, both
 * were roughly 30px. */
const BTN_BASE =
  'inline-flex items-center justify-center gap-2 rounded-chip px-4 font-sans text-sm ' +
  'transition-[background-color,border-color,color,transform] duration-fast ease-ui ' +
  'active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50'

export const btnPrimary =
  `${BTN_BASE} min-h-11 bg-accent-red font-bold text-white hover:bg-accent-red-hover`

export const btnGhost =
  `${BTN_BASE} min-h-9 border border-white/15 font-semibold text-cream hover:bg-white/10`

/* Destructive reads as an outline that fills on hover rather than a second
 * solid red, which was all but indistinguishable from btnPrimary. */
export const btnDanger =
  `${BTN_BASE} min-h-9 border border-danger/70 font-bold text-danger hover:bg-accent-red hover:text-white`

/* Approve/confirm, the counterpart to btnDanger. Same outline-that-fills
 * shape so the two destructive-vs-constructive choices in the reviews and
 * messages lists read as a pair. */
export const btnSuccess =
  `${BTN_BASE} min-h-9 border border-success/70 font-bold text-success hover:bg-success hover:text-admin-bg`

export const btnToggle = (active: boolean): string =>
  `${BTN_BASE} min-h-9 font-bold ${
    active
      ? 'bg-accent-red text-white'
      : 'border border-white/15 text-admin-ink hover:bg-white/10'
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
  const dialogRef = useRef<HTMLDivElement>(null)

  useFocusTrap(dialogRef)

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
        ref={dialogRef}
        className={`${cardClass} animate-pop-in w-full ${width} max-h-[90vh] overflow-hidden`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
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
          <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-4">
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