import { useCallback } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { LogOut, Package } from 'lucide-react'
import { fetchMyOrders } from '../api/orders'
import {
  ORDER_TYPE_LABELS,
  PAYMENT_LABELS,
  STATUS_LABELS,
} from '../api/orders'
import type { Order } from '../api/orders'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { useToast } from '../components/common/Toast'
import { EmptyState, ErrorState, LoadingState } from '../components/common/States'
import OrderStatusTrail from '../components/orders/OrderStatusTrail'
import { formatDateTime, formatPrice } from '../utils'

const statusTone = (status: Order['status']): string => {
  if (status === 'DELIVERED') return 'bg-olive text-white'
  if (status === 'CANCELLED') return 'bg-ink-muted text-white'
  return 'bg-amber text-ink-dark'
}

export default function AccountPage() {
  const { user, token, isChecking, logout } = useAuth()
  const { menu } = useStore()
  const { addItem, openCart } = useCart()
  const { notify } = useToast()

  const loadOrders = useCallback(
    () => (token ? fetchMyOrders(token) : Promise.resolve([])),
    [token],
  )
  const { data, loading, error, reload } = useAsync(loadOrders)

  if (isChecking) {
    return (
      <main className="page-container">
        <LoadingState label="Checking your session…" />
      </main>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  const orders = data ?? []

  /**
   * Reorder rebuilds the basket from the order snapshot, matching lines back to
   * the live menu. Dishes retired since then are skipped and called out, rather
   * than silently dropped.
   */
  const reorder = (order: Order) => {
    let added = 0
    let missing = 0

    for (const line of order.items) {
      const item = menu.find((dish) => dish.slug === line.slug)
      if (!item) {
        missing += 1
        continue
      }
      const size =
        item.sizes.find((option) => option.price === line.unitPrice) ?? null
      const extras = line.extras
        .map((extra) => item.extras.find((option) => option.id === extra.id))
        .filter((extra): extra is NonNullable<typeof extra> => Boolean(extra))

      addItem(item, line.quantity, { size, extras })
      added += 1
    }

    if (added === 0) {
      notify('None of those dishes are on the menu right now', 'error')
      return
    }
    notify(
      missing > 0
        ? `Added ${added} item${added === 1 ? '' : 's'} — ${missing} no longer available`
        : 'Added back to your box',
    )
    openCart()
  }

  return (
    <main className="page-container">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="section-heading text-4xl sm:text-5xl">My Account</h1>
          <p className="mt-1 font-sans text-sm text-ink-muted">
            {user.name} · {user.email}
            {user.phone ? ` · ${user.phone}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          {user.role === 'ADMIN' && (
            <Link to="/admin" className="btn-comic-cream px-5 py-2.5 text-sm">
              Admin Panel
            </Link>
          )}
          <button
            type="button"
            onClick={logout}
            className="btn-comic-cream inline-flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sign Out
          </button>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl uppercase text-header-brown">
        Order History
      </h2>

      {loading ? (
        <LoadingState label="Fetching your orders…" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          hint="Once you place an order it will show up here, with live status."
          action={
            <Link to="/menu" className="btn-comic-red px-6 py-2.5">
              Browse the menu
            </Link>
          }
        />
      ) : (
        <ul className="mt-6 space-y-5">
          {orders.map((order) => (
            <li key={order.id} className="card-comic rounded-2xl bg-card-bg p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-accent-red" aria-hidden="true" />
                    <span className="font-display text-xl text-header-brown">
                      {order.reference}
                    </span>
                    <span
                      className={`rounded-full border-2 border-ink-dark px-2.5 py-0.5 font-sans text-[11px] font-bold uppercase ${statusTone(order.status)}`}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-xs text-ink-muted">
                    {formatDateTime(order.createdAt)} ·{' '}
                    {ORDER_TYPE_LABELS[order.orderType]} ·{' '}
                    {PAYMENT_LABELS[order.paymentMethod]} ·{' '}
                    {order.paymentStatus === 'PAID' ? 'Paid' : 'Unpaid'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-accent-red">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 border-t-2 border-dashed border-ink-dark pt-4">
                {order.items.map((line, index) => (
                  <li
                    key={`${order.id}-${line.slug}-${index}`}
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

              {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                <div className="mt-4 border-t-2 border-dashed border-ink-dark pt-4">
                  <OrderStatusTrail
                    status={order.status}
                    orderType={order.orderType}
                  />
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2 border-t-2 border-dashed border-ink-dark pt-4">
                <button
                  type="button"
                  onClick={() => reorder(order)}
                  className="btn-comic-red px-5 py-2 text-sm"
                >
                  Reorder
                </button>
                <Link
                  to={`/track/${order.reference}`}
                  className="btn-comic-cream px-5 py-2 text-sm"
                >
                  Track
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
