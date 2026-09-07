import { get, post } from './http'

export const PAYMENT_METHODS = [
  {
    value: 'CASH_ON_DELIVERY',
    label: 'Cash',
    hint: 'Pay in cash on collection or delivery.',
  },
  { value: 'ESEWA', label: 'eSewa', hint: 'Pay from your eSewa wallet.' },
  { value: 'KHALTI', label: 'Khalti', hint: 'Pay from your Khalti wallet.' },
  { value: 'CARD', label: 'Card', hint: 'Pay by card at the door.' },
] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['value']

export const ORDER_TYPES = [
  {
    value: 'DELIVERY',
    label: 'Delivery',
    hint: 'Rs 50 delivery fee',
  },
  { value: 'TAKEAWAY', label: 'Takeaway', hint: 'Collect in store' },
  { value: 'DINE_IN', label: 'Dine-In', hint: 'Eat with us' },
] as const

export type OrderType = (typeof ORDER_TYPES)[number]['value']

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

/**
 * A cart line as the API wants it: what was ordered, never what it costs.
 * The server prices every order from the menu table.
 */
export type OrderLineInput = {
  menuItem: string
  quantity: number
  extras?: string[]
  size?: string
}

export type CreateOrderInput = {
  customerName: string
  customerPhone: string
  customerAddress?: string
  customerNote?: string
  items: OrderLineInput[]
  orderType: OrderType
  paymentMethod: PaymentMethod
}

export type OrderLine = {
  itemId: string
  slug: string
  name: string
  unitPrice: number
  quantity: number
  extras: { id: string; label: string; price: number }[]
  lineTotal: number
}

export type Order = {
  id: string
  reference: string
  customerName: string
  customerPhone: string
  customerAddress: string | null
  customerNote: string | null
  items: OrderLine[]
  subtotal: number
  deliveryFee: number
  total: number
  orderType: OrderType
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdAt: string
}

export type OrderTracking = {
  reference: string
  status: OrderStatus
  orderType: OrderType
  paymentStatus: PaymentStatus
  total: number
  createdAt: string
  updatedAt: string
}

export const placeOrder = (order: CreateOrderInput, token?: string) =>
  post<Order>('/orders', order, token)

export const fetchMyOrders = (token: string) =>
  get<Order[]>('/orders/mine', token)

export const trackOrder = (reference: string) =>
  get<OrderTracking>(`/orders/${encodeURIComponent(reference)}/track`)

/** Ordered kitchen journey, used to draw the tracking progress bar. */
export const STATUS_FLOW: OrderStatus[] = [
  'PLACED',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PLACED: 'Placed',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY: 'Ready',
  OUT_FOR_DELIVERY: 'On the way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  DELIVERY: 'Delivery',
  DINE_IN: 'Dine-in',
  TAKEAWAY: 'Takeaway',
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH_ON_DELIVERY: 'Cash',
  CARD: 'Card',
  ESEWA: 'eSewa',
  KHALTI: 'Khalti',
}
