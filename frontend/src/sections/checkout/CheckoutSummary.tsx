import { type CartItem } from '../../context/CartContext'
import CheckoutItemRow from '../../components/checkout/CheckoutItemRow'
import OrderSummary from '../../components/checkout/OrderSummary'
import { buttonClass } from '../../components/common/Button'

type CheckoutSummaryProps = {
  items: CartItem[]
  cartCount: number
  subtotal: number
  deliveryFee: number
  total: number
  onBackToMenu: () => void
  onPlaceOrder: () => void
  /** Mirrors the page's submit state so this button cannot fire a second order. */
  submitting?: boolean
}

export default function CheckoutSummary({
  items,
  cartCount,
  subtotal,
  deliveryFee,
  total,
  onBackToMenu,
  onPlaceOrder,
  submitting = false,
}: CheckoutSummaryProps) {
  return (
    <div className="card-comic rounded-card p-6 shadow-comic-lg sm:p-8">
      <h1 className="section-heading">Checkout</h1>
      <p className="mt-1 font-sans text-sm font-medium text-ink-muted">
        Review your order, then confirm to place it.
      </p>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <CheckoutItemRow key={item.key} item={item} />
        ))}
      </ul>

      <OrderSummary
        itemCount={cartCount}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBackToMenu}
          disabled={submitting}
          className={buttonClass({ variant: 'secondary', size: 'md' })}
        >
          Add More
        </button>
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={submitting}
          className={buttonClass({ size: 'md', className: 'flex-1' })}
        >
          {submitting ? 'Placing order…' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}
