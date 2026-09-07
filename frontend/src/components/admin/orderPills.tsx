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

export const STATUS_STYLES: Record<OrderStatus, string> = {
  PLACED: 'bg-[#3d2a14] text-amber border-amber/40',
  CONFIRMED: 'bg-[#2b2f14] text-yellow-200 border-yellow-400/40',
  PREPARING: 'bg-[#3a1e10] text-orange-300 border-orange-400/40',
  READY: 'bg-[#14331f] text-emerald-300 border-emerald-400/40',
  OUT_FOR_DELIVERY: 'bg-[#14253f] text-blue-300 border-blue-400/40',
  DELIVERED: 'bg-[#1f2a0f] text-lime-300 border-lime-400/40',
  CANCELLED: 'bg-[#3a1410] text-red-300 border-red-400/40',
}

const PAYMENT_STYLES: Record<PaymentMethod, string> = {
  CASH_ON_DELIVERY: 'bg-[#2b1609] text-amber',
  CARD: 'bg-[#2a1430] text-purple-300',
  ESEWA: 'bg-[#14331f] text-emerald-300',
  KHALTI: 'bg-[#2a1430] text-purple-300',
}

const TYPE_STYLES: Record<OrderType, string> = {
  DINE_IN: 'bg-white/5 text-cream',
  TAKEAWAY: 'bg-[#3a1e10] text-orange-200',
  DELIVERY: 'bg-[#14253f] text-blue-200',
}

export function OrderStatusPill({
  status,
  onClick,
}: {
  status: OrderStatus
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}) {
  const classes = `rounded-full border px-2.5 py-1 font-sans text-xs font-bold transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-ui ${STATUS_STYLES[status]}`

  if (!onClick) {
    return <span className={classes}>{STATUS_LABELS[status]}</span>
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title="Click to advance status"
      className={`${classes} cursor-pointer hover:scale-105`}
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
        paid ? 'border-emerald-400/50' : 'border-red-400/50'
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
