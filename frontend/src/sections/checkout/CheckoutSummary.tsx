import { type CartItem } from '../../context/CartContext'
import CheckoutItemRow from '../../components/checkout/CheckoutItemRow'
import OrderSummary from '../../components/checkout/OrderSummary'

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
    <div className="card-comic rounded-2xl p-6 shadow-[8px_8px_0_#241A12] sm:p-8">
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
          className="btn-comic-cream px-6 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add More
        </button>
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={submitting}
          className="btn-comic-red flex-1 px-6 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Placing order…' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}
