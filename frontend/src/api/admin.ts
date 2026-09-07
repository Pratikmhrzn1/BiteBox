import { get, patch } from './http'
import type {
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from './orders'

export type AdminSummary = {
  userCount: number
  orderCount: number
  openOrders: number
  pendingPayments: number
  newMessages: number
  pendingReviews: number
  paidAmount: number
  ordersToday: number
  revenueToday: number
}

export type AdminUser = {
  id: string
  name: string
  email: string
  phone: string | null
  role: 'CUSTOMER' | 'ADMIN'
  createdAt: string
  _count: { orders: number }
}

export type AdminOrder = Order & {
  user: { id: string; name: string; email: string; phone: string | null } | null
}

export type AdminPayment = {
  id: string
  reference: string
  customerName: string
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdAt: string
}

export type SeriesPoint = { label: string; value: number }

export type Analytics = {
  dailyOrders: SeriesPoint[]
  dailyRevenue: SeriesPoint[]
  topItems: SeriesPoint[]
  peakHours: SeriesPoint[]
  orderTypeSplit: SeriesPoint[]
  byCategory: { label: string; orders: number; revenue: number }[]
  averageRating: number
  reviewCount: number
}

export const fetchSummary = (token: string) =>
  get<AdminSummary>('/admin/summary', token)

export const fetchAnalytics = (token: string) =>
  get<Analytics>('/admin/analytics', token)

export const fetchUsers = (token: string) => get<AdminUser[]>('/admin/users', token)

export const fetchOrders = (token: string) =>
  get<AdminOrder[]>('/admin/orders', token)

export const fetchPayments = (token: string) =>
  get<AdminPayment[]>('/admin/payments', token)

export const updateOrderStatus = (
  id: string,
  status: OrderStatus,
  token: string,
) => patch<AdminOrder>(`/admin/orders/${id}/status`, { status }, token)

export const updatePaymentStatus = (
  id: string,
  paymentStatus: PaymentStatus,
  token: string,
) => patch<AdminOrder>(`/admin/orders/${id}/payment`, { paymentStatus }, token)
