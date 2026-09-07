/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertTriangle, Check, X } from 'lucide-react'

type ToastTone = 'success' | 'error'

type Toast = {
  id: number
  message: string
  tone: ToastTone
}

type ToastContextValue = {
  notify: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DISMISS_AFTER_MS = 3200

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((current) => [...current, { id, message, tone }])
      window.setTimeout(() => dismiss(id), DISMISS_AFTER_MS)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-rise-in pointer-events-auto flex items-center gap-3 rounded-control border-2 border-ink-dark px-4 py-3 shadow-comic ${
              toast.tone === 'success' ? 'bg-amber' : 'bg-accent-red'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink-dark ${
                toast.tone === 'success' ? 'bg-white' : 'bg-white'
              }`}
              aria-hidden="true"
            >
              {toast.tone === 'success' ? (
                <Check className="h-3.5 w-3.5 text-ink-dark" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-accent-red" />
              )}
            </span>
            <p
              className={`flex-1 font-sans text-sm font-bold ${
                toast.tone === 'success' ? 'text-ink-dark' : 'text-white'
              }`}
            >
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className={`tap-target shrink-0 rounded-full p-1 transition-colors duration-fast ease-ui hover:bg-black/10 ${
                toast.tone === 'success' ? 'text-ink-dark' : 'text-white'
              }`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
