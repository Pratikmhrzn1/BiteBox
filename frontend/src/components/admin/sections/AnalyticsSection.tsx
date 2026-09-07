import { useCallback } from 'react'
import { fetchAnalytics } from '../../../api/admin'
import type { SeriesPoint } from '../../../api/admin'
import { useAsync } from '../../../hooks/useAsync'
import { useAuth } from '../../../context/AuthContext'
import { formatPrice } from '../../../utils'
import { PanelCard } from '../ui'
import { AdminError, AdminLoading } from '../AdminStates'

/** Palette reused across the donut and category charts. */
const SLICE_COLORS = ['#CE3D27', '#D25F26', '#FFC93C', '#717D07', '#7D4A37']

function BarTooltip({ label, value }: { label: string; value: string }) {
  return (
    <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded bg-[#1A0E07] px-2 py-1 font-sans text-[10px] font-bold whitespace-nowrap text-amber opacity-0 transition group-hover:opacity-100">
      {label}: {value}
    </span>
  )
}

function VerticalBars({
  data,
  format = (value: number) => String(value),
  color = 'bg-amber',
}: {
  data: SeriesPoint[]
  format?: (value: number) => string
  color?: string
}) {
  const max = Math.max(...data.map((point) => point.value), 1)
  return (
    <div className="flex h-40 items-end gap-1.5">
      {data.map((point, index) => (
        <div
          key={`${point.label}-${index}`}
          className="group relative flex h-full flex-1 flex-col justify-end"
        >
          <BarTooltip label={point.label} value={format(point.value)} />
          <div
            className={`${color} w-full rounded-t transition hover:brightness-110`}
            // Zero-value bars keep a 2px stub so the axis still reads as a series.
            style={{ height: `max(2px, ${(point.value / max) * 100}%)` }}
          />
        </div>
      ))}
    </div>
  )
}

function AxisLabels({ data }: { data: SeriesPoint[] }) {
  return (
    <div className="mt-2 flex justify-between">
      {data.map((point, index) => (
        <span
          key={`${point.label}-${index}`}
          className="flex-1 text-center font-sans text-[10px] font-bold text-admin-muted uppercase"
        >
          {point.label}
        </span>
      ))}
    </div>
  )
}

/** Conic-gradient donut — no chart library needed for a simple share view. */
function Donut({ data }: { data: SeriesPoint[] }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0)

  if (total === 0) {
    return (
      <p className="py-8 text-center font-sans text-sm text-admin-muted">
        No orders to break down yet.
      </p>
    )
  }

  // Running totals give each slice its start/end angle in one pass.
  const stops = data
    .reduce<{ offset: number; parts: string[] }>(
      ({ offset, parts }, slice, index) => {
        const start = (offset / total) * 100
        const end = ((offset + slice.value) / total) * 100
        const color = SLICE_COLORS[index % SLICE_COLORS.length]
        return {
          offset: offset + slice.value,
          parts: [...parts, `${color} ${start}% ${end}%`],
        }
      },
      { offset: 0, parts: [] },
    )
    .parts.join(', ')

  return (
    <div className="flex items-center gap-5">
      <div
        className="h-32 w-32 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(${stops})`,
          mask: 'radial-gradient(circle, transparent 52%, black 53%)',
          WebkitMask: 'radial-gradient(circle, transparent 52%, black 53%)',
        }}
        aria-hidden="true"
      />
      <ul className="flex-1 space-y-2">
        {data.map((slice, index) => (
          <li key={slice.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: SLICE_COLORS[index % SLICE_COLORS.length] }}
              aria-hidden="true"
            />
            <span className="flex-1 font-sans text-sm font-semibold text-cream">
              {slice.label}
            </span>
            <span className="font-sans text-sm font-bold text-amber">
              {Math.round((slice.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AnalyticsSection() {
  const { token } = useAuth()

  const loadAnalytics = useCallback(
    () => (token ? fetchAnalytics(token) : Promise.reject(new Error('Not signed in'))),
    [token],
  )
  const { data, loading, error, reload } = useAsync(loadAnalytics)

  if (loading) return <AdminLoading label="Crunching the numbers…" />
  if (error) return <AdminError message={error} onRetry={reload} />
  if (!data) return null

  const maxPeak = Math.max(...data.peakHours.map((hour) => hour.value), 1)
  const maxTopItem = Math.max(...data.topItems.map((item) => item.value), 1)
  const totalRevenue = data.dailyRevenue.reduce((sum, day) => sum + day.value, 0)
  const totalOrders = data.dailyOrders.reduce((sum, day) => sum + day.value, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Orders · 7 days', value: String(totalOrders) },
          { label: 'Revenue · 7 days', value: formatPrice(totalRevenue) },
          {
            label: 'Avg order value',
            value: totalOrders === 0 ? '—' : formatPrice(Math.round(totalRevenue / totalOrders)),
          },
          {
            label: 'Avg rating',
            value: data.reviewCount === 0 ? '—' : `${data.averageRating}★`,
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/5 bg-admin-surface p-5">
            <p className="font-sans text-[11px] font-bold tracking-widest text-admin-muted uppercase">
              {stat.label}
            </p>
            <p className="mt-2 truncate font-sans text-2xl font-bold text-amber">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PanelCard title="Orders · Last 7 Days">
          <VerticalBars data={data.dailyOrders} color="bg-amber" />
          <AxisLabels data={data.dailyOrders} />
        </PanelCard>

        <PanelCard title="Revenue · Last 7 Days">
          <VerticalBars
            data={data.dailyRevenue}
            color="bg-accent-red"
            format={(value) => formatPrice(value)}
          />
          <AxisLabels data={data.dailyRevenue} />
        </PanelCard>

        <PanelCard title="Best Sellers">
          {data.topItems.length === 0 ? (
            <p className="py-8 text-center font-sans text-sm text-admin-muted">
              No sales recorded yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {data.topItems.map((item) => (
                <li key={item.label}>
                  <div className="mb-1 flex items-center justify-between gap-2 font-sans text-xs">
                    <span className="font-semibold text-cream">{item.label}</span>
                    <span className="font-bold text-amber">{item.value} sold</span>
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

        <PanelCard title="Order Type Split">
          <Donut data={data.orderTypeSplit} />
        </PanelCard>

        <PanelCard title="Peak Hours">
          <div className="flex h-40 items-end gap-0.5">
            {data.peakHours.map((hour) => (
              <div
                key={hour.label}
                className="group relative flex h-full flex-1 flex-col justify-end"
              >
                <BarTooltip label={hour.label} value={`${hour.value} orders`} />
                <div
                  className="w-full rounded-t bg-olive transition hover:brightness-125"
                  style={{ height: `max(2px, ${(hour.value / maxPeak) * 100}%)` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between font-sans text-[10px] font-bold text-admin-muted uppercase">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>
        </PanelCard>

        <PanelCard title="Sales by Category">
          {data.byCategory.length === 0 ? (
            <p className="py-8 text-center font-sans text-sm text-admin-muted">
              No sales recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-sm">
                <thead className="text-[11px] font-bold tracking-widest text-admin-muted uppercase">
                  <tr>
                    <th className="pb-2">Category</th>
                    <th className="pb-2 text-right">Items sold</th>
                    <th className="pb-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byCategory.map((row, index) => (
                    <tr key={row.label} className="border-t border-white/5">
                      <td className="py-2.5">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-sm"
                            style={{
                              backgroundColor:
                                SLICE_COLORS[index % SLICE_COLORS.length],
                            }}
                            aria-hidden="true"
                          />
                          <span className="font-semibold text-cream">{row.label}</span>
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-admin-ink">{row.orders}</td>
                      <td className="py-2.5 text-right font-bold text-amber">
                        {formatPrice(row.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PanelCard>
      </div>
    </div>
  )
}
