import { useCallback, useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { trackOrder } from '../api/orders'
import {
  ORDER_TYPE_LABELS,
  PAYMENT_LABELS,
  STATUS_LABELS,
} from '../api/orders'
import { useAsync } from '../hooks/useAsync'
import OrderStatusTrail from '../components/orders/OrderStatusTrail'
import { fieldClass } from '../components/common/formStyles'
import { formatDateTime, formatPrice } from '../utils'
import { buttonClass } from '../components/common/Button'

export default function TrackOrderPage() {
  const { reference: routeReference } = useParams<{ reference?: string }>()
  const navigate = useNavigate()

  const [input, setInput] = useState(routeReference ?? '')

  // Looking a reference up straight from the URL means the confirmation page
  // and the account page can deep-link into a live status view. With no
  // reference in the URL the page is just the lookup form.
  const lookup = useCallback(
    () => (routeReference ? trackOrder(routeReference) : Promise.resolve(null)),
    [routeReference],
  )
  const { data: order, error, loading } = useAsync(lookup)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = input.trim().toUpperCase()
    if (!trimmed) return
    navigate(`/track/${encodeURIComponent(trimmed)}`)
  }

  return (
    <main className="page-container max-w-2xl">
      <h1 className="section-heading text-4xl sm:text-5xl">Track Your Order</h1>
      <p className="mt-1 font-sans text-sm text-ink-muted">
        Enter the reference from your confirmation, e.g. BB-1042.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="BB-1042"
            aria-label="Order reference"
            className={`${fieldClass(false)} pl-9 uppercase`}
          />
        </div>
        <button type="submit" className={buttonClass({ size: 'md', className: 'shrink-0' })}>
          Track
        </button>
      </form>

      {loading && routeReference && (
        <p className="mt-8 text-center font-sans text-sm font-bold text-ink-muted">
          Looking that up…
        </p>
      )}

      {error && !loading && (
        <div className="card-comic mt-8 rounded-card bg-card-bg p-6 text-center">
          <p className="font-display text-2xl uppercase text-header-brown">
            No order found
          </p>
          <p className="mt-2 font-sans text-sm text-ink-muted">
            We couldn’t find an order with that reference. Double-check the code
            from your confirmation.
          </p>
        </div>
      )}

      {order && !loading && !error && (
        <div className="card-comic mt-8 rounded-card bg-card-bg p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-ink-muted">
                Order
              </p>
              <p className="font-display text-3xl text-header-brown">
                {order.reference}
              </p>
              <p className="mt-1 font-sans text-sm text-ink-muted">
                Placed {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-ink-muted">
                Total
              </p>
              <p className="font-display text-3xl text-accent-red">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t-2 border-dashed border-ink-dark pt-6">
            <OrderStatusTrail status={order.status} orderType={order.orderType} />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t-2 border-dashed border-ink-dark pt-6 sm:grid-cols-3">
            {[
              { term: 'Status', detail: STATUS_LABELS[order.status] },
              { term: 'Type', detail: ORDER_TYPE_LABELS[order.orderType] },
              {
                term: 'Payment',
                detail:
                  order.paymentStatus === 'PAID'
                    ? 'Paid'
                    : order.paymentStatus === 'PENDING'
                      ? 'Due on delivery'
                      : PAYMENT_LABELS.CASH_ON_DELIVERY,
              },
            ].map(({ term, detail }) => (
              <div key={term}>
                <dt className="font-sans text-xs font-bold uppercase tracking-widest text-ink-muted">
                  {term}
                </dt>
                <dd className="font-sans text-base font-bold text-ink-dark">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </main>
  )
}
