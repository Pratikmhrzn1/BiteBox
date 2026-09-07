import { useCallback } from 'react'
import {
  ArrowRight,
  Download,
  Flame,
  Mail,
  PieChart,
  Plus,
  ReceiptText,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import { fetchAnalytics, fetchOrders } from '../../../api/admin'
import type { AdminSummary } from '../../../api/admin'
import type { AsyncState } from '../../../hooks/useAsync'
import { useAsync } from '../../../hooks/useAsync'
import { useAuth } from '../../../context/AuthContext'
import { formatPrice, formatTime } from '../../../utils'
import { PanelCard } from '../ui'
import { AdminError, AdminLoading } from '../AdminStates'
import { OrderStatusPill, TypeBadge } from '../orderPills'
import { downloadOrdersCsv } from '../csv'
import type { AdminSection } from '../nav'

type DashboardSectionProps = {
  summary: AsyncState<AdminSummary>
  onAddMenuItem: () => void
  onOpenSection: (section: AdminSection) => void
}

/** Orders still moving through the kitchen, newest first. */
const OPEN_STATUSES = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY']

export default function DashboardSection({
  summary,
  onAddMenuItem,
  onOpenSection,
}: DashboardSectionProps) {
  const { token } = useAuth()

  const loadOrders = useCallback(
    () => (token ? fetchOrders(token) : Promise.reject(new Error('Not signed in'))),
    [token],
  )
  const loadAnalytics = useCallback(
    () => (token ? fetchAnalytics(token) : Promise.reject(new Error('Not signed in'))),
    [token],
  )

  const orders = useAsync(loadOrders)
  const analytics = useAsync(loadAnalytics)

  if (summary.loading || orders.loading || analytics.loading) {
    return <AdminLoading label="Loading dashboard…" />
  }

  const error = summary.error ?? orders.error ?? analytics.error
  if (error) {
    return (
      <AdminError
        message={error}
        onRetry={() => {
          summary.reload()
          orders.reload()
          analytics.reload()
        }}
      />
    )
  }

  const allOrders = orders.data ?? []
  const liveOrders = allOrders
    .filter((order) => OPEN_STATUSES.includes(order.status))
    .slice(0, 6)
  const topItems = analytics.data?.topItems ?? []
  const maxTopItem = topItems.reduce((max, item) => Math.max(max, item.value), 0)

  const kpis = [
    {
      label: 'Orders Today',
      value: String(summary.data?.ordersToday ?? 0),
      note: `${summary.data?.orderCount ?? 0} all time`,
      Icon: ReceiptText,
      color: 'text-amber',
    },
    {
      label: 'Revenue Today',
      value: formatPrice(summary.data?.revenueToday ?? 0),
      note: `${formatPrice(summary.data?.paidAmount ?? 0)} collected`,
      Icon: TrendingUp,
      color: 'text-emerald-300',
    },
    {
      label: 'Top Item',
      value: topItems[0]?.label ?? '—',
      note: topItems[0] ? `${topItems[0].value} sold` : 'No sales yet',
      Icon: Flame,
      color: 'text-orange-300',
    },
    {
      label: 'Avg Rating',
      value: analytics.data?.reviewCount
        ? `${analytics.data.averageRating}★`
        : '—',
      note: `${analytics.data?.reviewCount ?? 0} reviews`,
      Icon: Star,
      color: 'text-yellow-300',
    },
  ]

  const attention = [
    {
      label: 'Open orders',
      value: summary.data?.openOrders ?? 0,
      section: 'orders' as const,
      Icon: ReceiptText,
    },
    {
      label: 'Unpaid orders',
      value: summary.data?.pendingPayments ?? 0,
      section: 'orders' as const,
      Icon: TrendingUp,
    },
    {
      label: 'New messages',
      value: summary.data?.newMessages ?? 0,
      section: 'messages' as const,
      Icon: Mail,
    },
    {
      label: 'Reviews to moderate',
      value: summary.data?.pendingReviews ?? 0,
      section: 'reviews' as const,
      Icon: Star,
    },
    {
      label: 'Customers',
      value: summary.data?.userCount ?? 0,
      section: 'customers' as const,
      Icon: Users,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, note, Icon, color }) => (
          <div key={label} className="rounded-2xl border border-white/5 bg-admin-surface p-5">
            <div className="flex items-center gap-2 text-admin-muted">
              <Icon className="h-4 w-4" />
              <p className="font-sans text-[11px] font-bold tracking-widest uppercase">
                {label}
              </p>
            </div>
            <p className={`mt-2 truncate font-sans text-2xl font-bold ${color}`}>
              {value}
            </p>
            <p className="mt-0.5 font-sans text-xs font-semibold text-admin-muted">
              {note}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PanelCard
          title="Live Orders"
          action={
            <button
              type="button"
              onClick={() => onOpenSection('orders')}
              className="flex items-center gap-1 font-sans text-xs font-bold text-accent-red transition hover:text-orange-300"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          }
        >
          {liveOrders.length === 0 ? (
            <p className="py-6 text-center font-sans text-sm text-admin-muted">
              Nothing in the kitchen right now.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-left font-sans text-sm">
                <thead>
                  <tr className="text-[11px] font-bold tracking-widest text-admin-muted uppercase">
                    <th className="py-2 pr-3">Order</th>
                    <th className="py-2 pr-3">Customer</th>
                    <th className="py-2 pr-3">Time</th>
                    <th className="py-2 pr-3">Items</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {liveOrders.map((order) => (
                    <tr key={order.id} className="border-t border-white/5">
                      <td className="py-3 pr-3 font-mono text-xs font-bold text-amber">
                        {order.reference}
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-cream">
                          {order.customerName}
                        </p>
                        <TypeBadge type={order.orderType} />
                      </td>
                      <td className="py-3 pr-3 text-admin-ink">
                        {formatTime(order.createdAt)}
                      </td>
                      <td className="py-3 pr-3 text-admin-ink">
                        {order.items.reduce((sum, line) => sum + line.quantity, 0)} items
                      </td>
                      <td className="py-3">
                        <OrderStatusPill status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PanelCard>

        <div className="space-y-4">
          <PanelCard title="Needs Attention">
            <ul className="space-y-2">
              {attention.map(({ label, value, section, Icon }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => onOpenSection(section)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white/5"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-admin-muted" />
                    <span className="flex-1 font-sans text-sm font-semibold text-cream">
                      {label}
                    </span>
                    <span
                      className={`font-sans text-sm font-bold ${
                        value > 0 ? 'text-amber' : 'text-admin-muted'
                      }`}
                    >
                      {value}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </PanelCard>

          <PanelCard title="Top Items">
            {topItems.length === 0 ? (
              <p className="py-4 text-center font-sans text-sm text-admin-muted">
                No sales recorded yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {topItems.map((item) => (
                  <li key={item.label}>
                    <div className="mb-1 flex items-center justify-between gap-2 font-sans text-xs">
                      <span className="font-semibold text-cream">{item.label}</span>
                      <span className="font-bold text-amber">{item.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-amber"
                        style={{ width: `${(item.value / maxTopItem) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </PanelCard>

          <PanelCard title="Quick Actions">
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={onAddMenuItem}
                className="flex items-center gap-2 rounded-lg bg-accent-red px-3 py-2.5 font-sans text-sm font-bold text-white transition hover:bg-red-700"
              >
                <Plus className="h-4 w-4" /> Add Menu Item
              </button>
              <button
                type="button"
                onClick={() => onOpenSection('orders')}
                className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 font-sans text-sm font-semibold text-cream transition hover:bg-white/5"
              >
                <ArrowRight className="h-4 w-4" /> View All Orders
              </button>
              <button
                type="button"
                onClick={() => downloadOrdersCsv(allOrders)}
                className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 font-sans text-sm font-semibold text-cream transition hover:bg-white/5"
              >
                <Download className="h-4 w-4" /> Export Orders (CSV)
              </button>
              <button
                type="button"
                onClick={() => onOpenSection('analytics')}
                className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 font-sans text-sm font-semibold text-cream transition hover:bg-white/5"
              >
                <PieChart className="h-4 w-4" /> View Analytics
              </button>
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  )
}
