import { useCallback, useMemo, useState } from 'react'
import { Download, Printer, Search, X } from 'lucide-react'
import {
  fetchOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from '../../../api/admin'
import type { AdminOrder } from '../../../api/admin'
import {
  ORDER_TYPE_LABELS,
  PAYMENT_LABELS,
  STATUS_FLOW,
  STATUS_LABELS,
} from '../../../api/orders'
import type { OrderStatus, PaymentStatus } from '../../../api/orders'
import { useAsync } from '../../../hooks/useAsync'
import { useAuth } from '../../../context/AuthContext'
import { formatDateTime, formatPrice } from '../../../utils'
import { EmptyState, inputClass } from '../ui'
import { AdminError, AdminLoading } from '../AdminStates'
import { OrderStatusPill, PaymentBadge, TypeBadge } from '../orderPills'
import { downloadOrdersCsv } from '../csv'
import { useAdminToast } from '../AdminToast'

type Filter = 'All' | OrderStatus

const FILTERS: Filter[] = ['All', ...STATUS_FLOW, 'CANCELLED']

type OrdersSectionProps = {
  /** Lets the shell refresh its badge counters after a status change. */
  onChanged?: () => void
}

export default function OrdersSection({ onChanged }: OrdersSectionProps) {
  const { token } = useAuth()
  const { notify } = useAdminToast()

  const loadOrders = useCallback(
    () => (token ? fetchOrders(token) : Promise.reject(new Error('Not signed in'))),
    [token],
  )
  const { data, loading, error, reload, setData } = useAsync(loadOrders)

  const [filter, setFilter] = useState<Filter>('All')
  const [query, setQuery] = useState('')
  const [detailId, setDetailId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const orders = useMemo(() => data ?? [], [data])

  const counts = useMemo(() => {
    const tally: Record<string, number> = { All: orders.length }
    for (const status of [...STATUS_FLOW, 'CANCELLED' as const]) {
      tally[status] = orders.filter((order) => order.status === status).length
    }
    return tally
  }, [orders])

  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return orders.filter((order) => {
      if (filter !== 'All' && order.status !== filter) return false
      if (!normalized) return true
      return `${order.reference} ${order.customerName} ${order.customerPhone}`
        .toLowerCase()
        .includes(normalized)
    })
  }, [orders, filter, query])

  const detail = detailId
    ? (orders.find((order) => order.id === detailId) ?? null)
    : null

  /** Replaces one order in place so the table does not flash on every change. */
  const applyUpdate = (updated: AdminOrder) => {
    setData((current) =>
      current.map((order) => (order.id === updated.id ? updated : order)),
    )
    onChanged?.()
  }

  const advanceStatus = async (order: AdminOrder) => {
    if (!token) return
    const index = STATUS_FLOW.indexOf(order.status)
    if (index === -1 || index === STATUS_FLOW.length - 1) return

    // Deliveries pass through "on the way"; collections skip straight to done.
    const next =
      STATUS_FLOW[index + 1] === 'OUT_FOR_DELIVERY' && order.orderType !== 'DELIVERY'
        ? 'DELIVERED'
        : STATUS_FLOW[index + 1]

    setBusyId(order.id)
    try {
      applyUpdate(await updateOrderStatus(order.id, next, token))
      notify(`${order.reference} → ${STATUS_LABELS[next]}`)
    } catch (reason) {
      notify(
        reason instanceof Error ? reason.message : 'Could not update status',
        'error',
      )
    } finally {
      setBusyId(null)
    }
  }

  const setStatus = async (order: AdminOrder, status: OrderStatus) => {
    if (!token) return
    setBusyId(order.id)
    try {
      applyUpdate(await updateOrderStatus(order.id, status, token))
      notify(`${order.reference} → ${STATUS_LABELS[status]}`)
    } catch (reason) {
      notify(
        reason instanceof Error ? reason.message : 'Could not update status',
        'error',
      )
    } finally {
      setBusyId(null)
    }
  }

  const setPayment = async (order: AdminOrder, paymentStatus: PaymentStatus) => {
    if (!token) return
    setBusyId(order.id)
    try {
      applyUpdate(await updatePaymentStatus(order.id, paymentStatus, token))
      notify(`${order.reference} payment → ${paymentStatus}`)
    } catch (reason) {
      notify(
        reason instanceof Error ? reason.message : 'Could not update payment',
        'error',
      )
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <AdminLoading label="Loading orders…" />
  if (error) return <AdminError message={error} onRetry={reload} />

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-chip px-3 py-1.5 font-sans text-sm font-bold transition ${
                filter === id
                  ? 'bg-accent-red text-white'
                  : 'border border-white/15 text-admin-ink hover:bg-white/5'
              }`}
            >
              {id === 'All' ? 'All' : STATUS_LABELS[id]}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  filter === id ? 'bg-white/20' : 'bg-white/5'
                }`}
              >
                {counts[id] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => downloadOrdersCsv(filteredOrders)}
          className="inline-flex items-center gap-2 rounded-chip bg-accent-red px-4 py-2 font-sans text-sm font-bold text-white transition hover:bg-red-700"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="relative sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by reference, customer or phone…"
          className={`${inputClass} pl-9`}
        />
      </div>

      <div className="overflow-hidden rounded-card border border-white/5 bg-admin-surface">
        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            hint="Try a different filter or search term."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left font-sans text-sm">
              <thead className="text-[11px] font-bold tracking-widest text-admin-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Placed</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`cursor-pointer border-t border-white/5 transition hover:bg-white/5 ${
                      busyId === order.id ? 'opacity-50' : ''
                    }`}
                    onClick={() => setDetailId(order.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-bold text-amber">
                      {order.reference}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-cream">{order.customerName}</p>
                      <p className="text-xs text-admin-muted">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={order.orderType} />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentBadge
                        method={order.paymentMethod}
                        status={order.paymentStatus}
                      />
                    </td>
                    <td className="px-4 py-3 font-bold text-cream">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3 text-admin-ink">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusPill
                        status={order.status}
                        onClick={(event) => {
                          event.stopPropagation()
                          void advanceStatus(order)
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detail && (
        <OrderDetailPanel
          order={detail}
          busy={busyId === detail.id}
          onClose={() => setDetailId(null)}
          onSetStatus={(status) => void setStatus(detail, status)}
          onSetPayment={(status) => void setPayment(detail, status)}
        />
      )}
    </div>
  )
}

function OrderDetailPanel({
  order,
  busy,
  onClose,
  onSetStatus,
  onSetPayment,
}: {
  order: AdminOrder
  busy: boolean
  onClose: () => void
  onSetStatus: (status: OrderStatus) => void
  onSetPayment: (status: PaymentStatus) => void
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-admin-field shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Order ${order.reference} details`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-white/5 bg-admin-field px-5 py-4">
          <div>
            <p className="font-mono text-base font-bold text-amber">
              {order.reference}
            </p>
            <p className="font-sans text-xs text-admin-muted">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-chip p-1.5 text-admin-ink transition hover:bg-white/10 hover:text-cream"
            aria-label="Close order details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={`space-y-5 px-5 py-5 ${busy ? 'opacity-50' : ''}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-sans text-lg font-bold text-cream">
                {order.customerName}
              </p>
              <p className="font-sans text-sm text-admin-muted">
                {order.customerPhone}
              </p>
              {order.customerAddress && (
                <p className="mt-1 font-sans text-sm text-admin-ink">
                  {order.customerAddress}
                </p>
              )}
              {order.user && (
                <p className="mt-1 font-sans text-xs text-admin-muted">
                  Account: {order.user.email}
                </p>
              )}
            </div>
            <TypeBadge type={order.orderType} />
          </div>

          {order.customerNote && (
            <div className="rounded-chip border border-amber/30 bg-amber/10 px-3 py-2">
              <p className="font-sans text-xs font-bold tracking-widest text-amber uppercase">
                Note
              </p>
              <p className="mt-1 font-sans text-sm text-cream">
                {order.customerNote}
              </p>
            </div>
          )}

          <div>
            <p className="mb-2 font-sans text-xs font-bold tracking-widest text-amber uppercase">
              Items
            </p>
            <ul className="space-y-2">
              {order.items.map((line, index) => (
                <li
                  key={`${order.id}-${line.slug}-${index}`}
                  className="rounded-chip bg-[#403225] px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-sans text-sm font-semibold text-cream">
                      {line.quantity}× {line.name}
                    </span>
                    <span className="font-sans text-sm font-bold text-amber">
                      {formatPrice(line.lineTotal)}
                    </span>
                  </div>
                  {line.extras.length > 0 && (
                    <p className="mt-1 font-sans text-xs text-admin-muted">
                      {line.extras.map((extra) => extra.label).join(', ')}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5 rounded-chip border border-white/10 px-4 py-3 font-sans text-sm">
            <div className="flex justify-between text-admin-ink">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-admin-ink">
                <span>Delivery</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-white/10 pt-1.5">
              <span className="text-admin-ink">Total</span>
              <span className="text-xl font-bold text-amber">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs font-bold tracking-widest text-amber uppercase">
              Fulfilment status
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[...STATUS_FLOW, 'CANCELLED' as const].map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={busy}
                  onClick={() => onSetStatus(status)}
                  className={`rounded-chip px-2.5 py-1.5 font-sans text-xs font-bold transition disabled:opacity-50 ${
                    order.status === status
                      ? 'bg-accent-red text-white'
                      : 'border border-white/15 text-admin-ink hover:bg-white/5'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs font-bold tracking-widest text-amber uppercase">
              Payment · {PAYMENT_LABELS[order.paymentMethod]}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(['PENDING', 'PAID', 'FAILED', 'REFUNDED'] as PaymentStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={busy}
                    onClick={() => onSetPayment(status)}
                    className={`rounded-chip px-2.5 py-1.5 font-sans text-xs font-bold capitalize transition disabled:opacity-50 ${
                      order.paymentStatus === status
                        ? 'bg-accent-red text-white'
                        : 'border border-white/15 text-admin-ink hover:bg-white/5'
                    }`}
                  >
                    {status.toLowerCase()}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-2 rounded-chip border border-white/15 px-4 py-2.5 font-sans text-sm font-bold text-cream transition hover:bg-white/5"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
          </div>

          <p className="text-center font-sans text-xs text-admin-muted">
            {ORDER_TYPE_LABELS[order.orderType]} order
          </p>
        </div>
      </div>
    </div>
  )
}
