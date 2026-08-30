import { formatPrice } from '../../utils'

type OrderSummaryProps = {
  itemCount: number
  subtotal: number
  deliveryFee: number
  total: number
}

export default function OrderSummary({
  itemCount,
  subtotal,
  deliveryFee,
  total,
}: OrderSummaryProps) {
  return (
    <div className="mt-6 space-y-1.5 font-sans text-sm font-medium text-ink-dark">
      <div className="flex justify-between">
        <span>
          {itemCount} item{itemCount === 1 ? '' : 's'}
        </span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span>Delivery fee</span>
        <span>{formatPrice(deliveryFee)}</span>
      </div>
      <div className="flex justify-between border-t-2 border-dashed border-ink-dark pt-2 font-display text-xl text-header-brown uppercase">
        <span>Total</span>
        <span className="text-accent-red">{formatPrice(total)}</span>
      </div>
    </div>
  )
}
