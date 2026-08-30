import { useEffect, useState } from 'react'
import { Minus, Plus, Scooter, UtensilsCrossed, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cartLineTotal, useCart } from '../context/CartContext'
import { formatPrice } from '../utils'

const ORDER_TYPES = [
  { id: 'dine-in', label: 'Dine-In', Icon: UtensilsCrossed },
  { id: 'delivery', label: 'Delivery', Icon: Scooter },
] as const

type OrderType = (typeof ORDER_TYPES)[number]['id']

export default function CartDrawer() {
  const navigate = useNavigate()
  const {
    cart,
    cartCount,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    deliveryFee,
  } = useCart()
  const [orderType, setOrderType] = useState<OrderType>('dine-in')

  useEffect(() => {
    if (!isCartOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isCartOpen, closeCart])

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  const goToMenu = () => {
    closeCart()
    navigate('/menu')
  }

  const showDeliveryFee = orderType === 'delivery'
  const total = subtotal + (showDeliveryFee ? deliveryFee : 0)

  return (
    <div
      className={`fixed inset-0 z-50 bg-[rgba(36,26,18,0.55)] transition-opacity duration-300 ease-in-out ${
        isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={closeCart}
      aria-hidden={!isCartOpen}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col overflow-hidden border-l-2 border-ink-dark bg-card-bg shadow-[-6px_0_0_#241A12] transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b-2 border-ink-dark bg-amber px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl text-header-brown uppercase">
              Your Order
            </h2>
            {cartCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-red px-2 font-sans text-sm font-bold text-white shadow-[2px_2px_0_#241A12]">
                {cartCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full border-2 border-ink-dark bg-card-bg p-1.5 text-ink-dark shadow-[2px_2px_0_#241A12] transition hover:bg-accent-red hover:text-white"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="border-b-2 border-ink-dark px-5 py-4">
          <div className="flex gap-2">
            {ORDER_TYPES.map((type) => {
              const isActive = type.id === orderType
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setOrderType(type.id)}
                  className={
                    isActive
                      ? 'flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent-red px-3 py-2 font-sans text-sm font-bold text-white shadow-[3px_3px_0_#241A12] transition active:translate-y-0 active:shadow-none'
                      : 'flex flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-ink-dark bg-cream px-3 py-2 font-sans text-sm font-bold text-ink-dark transition hover:bg-amber'
                  }
>
                  <type.Icon className="h-4 w-4" aria-hidden="true" />
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              {/* <span className="text-6xl" aria-hidden="true">
                🍔
              </span> */}
              <p className="font-display text-xl text-header-brown uppercase">
                Your box is empty
              </p>
              <button
                type="button"
                onClick={goToMenu}
                className="btn-comic-red px-6 py-2.5 text-base"
              >
                Start smashing
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {cart.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center gap-3 rounded-2xl border-2 border-ink-dark bg-white p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-10 w-10 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-sans text-sm font-bold text-ink-dark">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="shrink-0 rounded-full p-0.5 text-ink-muted transition hover:bg-accent-red hover:text-white"
                        aria-label={`Remove ${item.name} from order`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {item.extras.length > 0 && (
                      <p className="mt-0.5 truncate font-sans text-xs font-medium text-ink-muted">
                        {item.extras.map((extra) => extra.label).join(', ')}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 rounded-full border-2 border-ink-dark bg-card-bg px-1.5 py-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                          className="p-0.5 text-ink-dark transition hover:text-accent-red"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-5 text-center font-sans text-sm font-bold text-ink-dark">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity + 1)
                          }
                          className="p-0.5 text-ink-dark transition hover:text-accent-red"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="shrink-0 font-sans text-sm font-bold text-accent-red">
                        {formatPrice(cartLineTotal(item))}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <footer className="space-y-3 border-t-2 border-ink-dark bg-cream px-5 py-4">
            <div className="space-y-1.5 font-sans text-sm font-medium text-ink-dark">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              {showDeliveryFee && (
                <div className="flex items-center justify-between">
                  <span>Delivery fee</span>
                  <span className="font-bold">{formatPrice(deliveryFee)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t-2 border-dashed border-ink-dark pt-3">
              <span className="font-display text-xl text-header-brown uppercase">
                Total
              </span>
              <span className="font-display text-2xl text-accent-red">
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="btn-comic-red w-full px-5 py-3.5 text-lg"
            >
              Proceed to Checkout
            </button>
            <p className="text-center font-sans text-xs font-medium text-ink-muted">
              Estimated 20–30 min
            </p>
          </footer>
        )}
      </aside>
    </div>
  )
}