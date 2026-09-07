import { Link, useLocation, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import {
  ORDER_TYPE_LABELS,
  PAYMENT_LABELS,
  type Order,
} from '../api/orders'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils'

type LocationState = { order?: Order }

export default function OrderConfirmationPage() {
  const { reference } = useParams<{ reference: string }>()
  const location = useLocation()
  const { user } = useAuth()

  // Checkout hands the full order over in navigation state. Landing here
  // directly (a refresh, a shared link) still works — we just show the
  // reference and point at the tracking page for the details.
  const order = (location.state as LocationState | null)?.order ?? null

  return (
    <main className="page-container max-w-2xl">
      <div className="card-comic rounded-2xl bg-card-bg p-6 text-center sm:p-10">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-ink-dark bg-olive shadow-[4px_4px_0_#241A12]">
          <Check className="h-10 w-10 text-white" aria-hidden="true" />
        </span>

        <h1 className="mt-6 font-display text-4xl uppercase text-header-brown">
          Order Confirmed!
        </h1>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          We’re firing up the grill. Keep this reference handy:
        </p>
        <p className="mt-3 font-display text-4xl text-accent-red">{reference}</p>

        {order && (
          <>
            <ul className="mt-8 space-y-2 border-t-2 border-dashed border-ink-dark pt-6 text-left">
              {order.items.map((line, index) => (
                <li
                  key={`${line.slug}-${index}`}
                  className="flex items-start justify-between gap-3 font-sans text-sm"
                >
                  <span className="text-ink-dark">
                    <span className="font-bold">{line.quantity}×</span> {line.name}
                    {line.extras.length > 0 && (
                      <span className="text-ink-muted">
                        {' '}
                        ({line.extras.map((extra) => extra.label).join(', ')})
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-bold text-ink-muted">
                    {formatPrice(line.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1.5 border-t-2 border-dashed border-ink-dark pt-4 text-left font-sans text-sm text-ink-dark">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">{formatPrice(order.subtotal)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span className="font-bold">{formatPrice(order.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-dashed border-ink-dark pt-2 font-display text-xl uppercase text-header-brown">
                <span>Total</span>
                <span className="text-accent-red">{formatPrice(order.total)}</span>
              </div>
            </div>

            <p className="mt-4 font-sans text-xs text-ink-muted">
              {ORDER_TYPE_LABELS[order.orderType]} ·{' '}
              {PAYMENT_LABELS[order.paymentMethod]} · Estimated 20–30 min
            </p>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to={`/track/${reference}`} className="btn-comic-red px-6 py-3">
            Track this order
          </Link>
          <Link
            to={user ? '/account' : '/menu'}
            className="btn-comic-cream px-6 py-3"
          >
            {user ? 'My orders' : 'Back to menu'}
          </Link>
        </div>
      </div>
    </main>
  )
}
