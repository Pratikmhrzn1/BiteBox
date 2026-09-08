/* eslint-disable react-refresh/only-export-components */
import type { MouseEvent } from 'react'
import {
  ORDER_TYPE_LABELS,
  PAYMENT_LABELS,
  STATUS_LABELS,
} from '../../api/orders'
import type {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '../../api/orders'

/* Ink, ground and edge all come off one status token - see the Status block
 * in tailwind.config.js for the measured contrast.
 *
 * Written out rather than composed from a `pill(token)` helper: Tailwind
 * scans source as plain text, so an interpolated `bg-${token}/15` matches
 * nothing and emits no CSS at all.
 *
 * The seven states keep seven distinct hues on purpose. This is an
 * operational pipeline, and folding "ready to hand over" into "delivered"
 * would cost the kitchen a distinction it acts on. */
export const STATUS_STYLES: Record<OrderStatus, string> = {
  PLACED: 'bg-amber/15 text-amber border-amber/70',
  CONFIRMED: 'bg-caution/15 text-caution border-caution/70',
  PREPARING: 'bg-warning/15 text-warning border-warning/70',
  READY: 'bg-success/15 text-success border-success/70',
  OUT_FOR_DELIVERY: 'bg-info/15 text-info border-info/70',
  DELIVERED: 'bg-done/15 text-done border-done/70',
  CANCELLED: 'bg-danger/15 text-danger border-danger/70',
}

const PAYMENT_STYLES: Record<PaymentMethod, string> = {
  CASH_ON_DELIVERY: 'bg-amber/15 text-amber',
  CARD: 'bg-plum/15 text-plum',
  ESEWA: 'bg-success/15 text-success',
  KHALTI: 'bg-plum/15 text-plum',
}

const TYPE_STYLES: Record<OrderType, string> = {
  DINE_IN: 'bg-white/5 text-cream',
  TAKEAWAY: 'bg-warning/15 text-warning',
  DELIVERY: 'bg-info/15 text-info',
}

export function OrderStatusPill({
  status,
  onClick,
}: {
  status: OrderStatus
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}) {
  /* min-h-8 when it is a control: at py-1 the clickable pill was 26px, which
   * clears WCAG 2.5.8 by two pixels and feels like it. The static span keeps
   * the tighter box, since a label is not a target. */
  const classes = `inline-flex items-center rounded-full border px-2.5 py-1 font-sans text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-ui ${STATUS_STYLES[status]}`

  if (!onClick) {
    return <span className={classes}>{STATUS_LABELS[status]}</span>
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title="Click to advance status"
      className={`${classes} min-h-8 cursor-pointer hover:brightness-125 active:scale-[0.96]`}
    >
      {STATUS_LABELS[status]}
    </button>
  )
}

export function PaymentBadge({
  method,
  status,
}: {
  method: PaymentMethod
  status: PaymentStatus
}) {
  const paid = status === 'PAID'
  return (
    <span
      className={`rounded-full border px-2.5 py-1 font-sans text-xs font-bold ${
        paid ? 'border-success/70' : 'border-danger/70'
      } ${PAYMENT_STYLES[method]}`}
    >
      {paid ? 'Paid · ' : 'Unpaid · '}
      {PAYMENT_LABELS[method]}
    </span>
  )
}

export function TypeBadge({ type }: { type: OrderType }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 font-sans text-xs font-bold ${TYPE_STYLES[type]}`}
    >
      {ORDER_TYPE_LABELS[type]}
    </span>
  )
}
