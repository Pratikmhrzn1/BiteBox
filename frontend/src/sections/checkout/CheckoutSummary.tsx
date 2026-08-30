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
}

export default function CheckoutSummary({
  items,
  cartCount,
  subtotal,
  deliveryFee,
  total,
  onBackToMenu,
  onPlaceOrder,
}: CheckoutSummaryProps) {
  return (
    <div className="card-comic rounded-2xl p-6 shadow-[8px_8px_0_#241A12] sm:p-8">
      <h1 className="section-heading">Checkout</h1>
      <p className="mt-1 font-sans text-sm font-medium text-ink-muted">
        Review your order, then confirm to place it.
      </p>

      {items.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <span className="text-6xl" aria-hidden="true">
            🍔
          </span>
          <p className="font-display text-xl text-header-brown uppercase">
            Your box is empty
          </p>
          <button
            type="button"
            onClick={onBackToMenu}
            className="btn-comic-red px-6 py-2.5 text-base"
          >
            Start smashing
          </button>
        </div>
      ) : (
        <>
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
              className="btn-comic-cream px-6 py-3 text-base"
            >
              Back to Menu
            </button>
            <button
              type="button"
              onClick={onPlaceOrder}
              className="btn-comic-red flex-1 px-6 py-3 text-base"
            >
              Place Order
            </button>
          </div>

          <p className="mt-4 text-center font-sans text-xs font-medium text-ink-muted">
            Checkout placeholder — order flow lands here for now.
          </p>
        </>
      )}
    </div>
  )
}
