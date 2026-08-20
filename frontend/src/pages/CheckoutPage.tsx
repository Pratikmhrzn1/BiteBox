import { useNavigate } from 'react-router-dom'
import { cartLineTotal, useCart } from '../context/CartContext'
import { formatPrice } from '../utils'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, cartCount, subtotal, deliveryFee, total, clearCart } = useCart()

  const handlePlaceOrder = () => {
    clearCart()
    navigate('/')
  }

  return (
    <main className="page-container max-w-3xl">
      <div className="card-comic rounded-2xl p-6 shadow-[8px_8px_0_#241A12] sm:p-8">
        <h1 className="section-heading">Checkout</h1>
        <p className="mt-1 font-sans text-sm font-medium text-ink-muted">
          Review your order, then confirm to place it.
        </p>

        {cart.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <span className="text-6xl" aria-hidden="true">
              🍔
            </span>
            <p className="font-display text-xl text-header-brown uppercase">
              Your box is empty
            </p>
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="btn-comic-red px-6 py-2.5 text-base"
            >
              Start smashing
            </button>
          </div>
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {cart.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center gap-3 rounded-xl border-2 border-ink-dark bg-white p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-bold text-ink-dark">
                      {item.name} × {item.quantity}
                    </p>
                    {item.extras.length > 0 && (
                      <p className="mt-0.5 truncate font-sans text-xs font-medium text-ink-muted">
                        {item.extras.map((extra) => extra.label).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 font-sans text-sm font-bold text-accent-red">
                    {formatPrice(cartLineTotal(item))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-1.5 font-sans text-sm font-medium text-ink-dark">
              <div className="flex justify-between">
                <span>{cartCount} item{cartCount === 1 ? '' : 's'}</span>
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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/menu')}
                className="btn-comic-cream px-6 py-3 text-base"
              >
                Back to Menu
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
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
    </main>
  )
}