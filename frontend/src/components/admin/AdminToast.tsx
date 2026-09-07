/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

type ToastContextValue = {
  notify: (message: string, tone?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

type ToastItem = { id: number; message: string; tone: 'success' | 'error' }

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const notify = useCallback(
    (message: string, tone: 'success' | 'error' = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((current) => [...current, { id, message, tone }])
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      }, 2600)
    },
    [],
  )

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-xl border px-4 py-3 shadow-2xl ${
              toast.tone === 'error'
                ? 'border-red-500/40 bg-[#3a1410] text-red-200'
                : 'border-emerald-500/30 bg-[#16351f] text-emerald-200'
            }`}
          >
            <Check className="h-4 w-4 shrink-0" />
            <span className="font-sans text-sm font-semibold">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useAdminToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useAdminToast must be used within AdminToastProvider')
  }
  return context
}