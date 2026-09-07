import type { AdminOrder } from '../../api/admin'
import { ORDER_TYPE_LABELS, PAYMENT_LABELS, STATUS_LABELS } from '../../api/orders'

const HEADER = [
  'Reference',
  'Customer',
  'Phone',
  'Type',
  'Items',
  'Subtotal (Rs)',
  'Delivery (Rs)',
  'Total (Rs)',
  'Payment',
  'Payment Status',
  'Order Status',
  'Placed At',
]

export function downloadOrdersCsv(orders: AdminOrder[]): void {
  const rows = orders.map((order) => [
    order.reference,
    order.customerName,
    order.customerPhone,
    ORDER_TYPE_LABELS[order.orderType],
    order.items.map((line) => `${line.quantity}× ${line.name}`).join('; '),
    String(order.subtotal),
    String(order.deliveryFee),
    String(order.total),
    PAYMENT_LABELS[order.paymentMethod],
    order.paymentStatus,
    STATUS_LABELS[order.status],
    new Date(order.createdAt).toLocaleString('en-GB'),
  ])

  const csv = [HEADER, ...rows]
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `bitebox-orders-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
