import { useEffect, useRef } from 'react'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ORDER_TYPES } from '../api/orders'
import { cartLineTotal, useCart } from '../context/CartContext'
import { formatPrice } from '../utils'
import { buttonClass } from '../components/common/Button'

export default function CartDrawer() {
  const navigate = useNavigate()
  const {
    cart,
    cartCount,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    orderType,
    setOrderType,
    subtotal,
    deliveryFee,
    total,
  } = useCart()

  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isCartOpen) return

    // The drawer stays mounted so it can slide, which means focus has to be
    // moved in deliberately and handed back on close - otherwise `inert`
    // drops the focused element and focus falls to <body>.
    returnFocusRef.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      returnFocusRef.current?.focus()
    }
  }, [isCartOpen, closeCart])

  const goTo = (path: string) => {
    closeCart()
    navigate(path)
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-[rgba(36,26,18,0.55)] transition-opacity duration-300 ease-in-out ${
        isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={closeCart}
      /* Closed, the drawer is still in the DOM so it can animate. `inert`
         takes it out of the tab order and the accessibility tree together;
         aria-hidden alone left ~15 invisible controls keyboard-reachable on
         every page. */
      inert={!isCartOpen}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col overflow-hidden border-l-2 border-ink-dark bg-card-bg shadow-comic-drawer transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b-2 border-ink-dark bg-amber px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-display-sm text-header-brown uppercase">
              Your Order
            </h2>
            {cartCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-red px-2 font-sans text-sm font-bold text-white shadow-comic-xs">
                {cartCount}
              </span>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            className="rounded-full border-2 border-ink-dark bg-card-bg p-1.5 text-ink-dark shadow-comic-xs transition hover:bg-accent-red hover:text-white"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="border-b-2 border-ink-dark px-5 py-4">
          <div className="flex gap-2">
            {ORDER_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setOrderType(type.value)}
                aria-pressed={orderType === type.value}
                className={
                  orderType === type.value
                    ? 'flex-1 rounded-full bg-accent-red px-3 py-2 font-sans text-sm font-bold text-white shadow-comic-sm transition'
                    : 'flex-1 rounded-full border-2 border-ink-dark bg-cream px-3 py-2 font-sans text-sm font-bold text-ink-dark transition hover:bg-amber'
                }
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="font-display text-xl text-header-brown uppercase">
                Your box is empty
              </p>
              <button
                type="button"
                onClick={() => goTo('/menu')}
                className={buttonClass({ size: 'md' })}
              >
                Start smashing
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {cart.map((item) => {
                const options = [
                  ...(item.size ? [item.size.label] : []),
                  ...item.extras.map((extra) => extra.label),
                ]
                return (
                  <li
                    key={item.key}
                    className="flex items-center gap-3 rounded-card border-2 border-ink-dark bg-white p-3"
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
                      {options.length > 0 && (
                        <p className="mt-0.5 truncate font-sans text-xs font-medium text-ink-muted">
                          {options.join(', ')}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 rounded-full border-2 border-ink-dark bg-card-bg px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
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
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
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
                )
              })}
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
              {deliveryFee > 0 && (
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
              <span className="font-display text-display-sm text-accent-red">
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => goTo('/checkout')}
              className={buttonClass({ size: 'lg', className: 'w-full' })}
            >
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-ink-muted transition hover:text-accent-red"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Clear box
              </button>
              <p className="font-sans text-xs font-medium text-ink-muted">
                Estimated 20–30 min
              </p>
            </div>
          </footer>
        )}
      </aside>
    </div>
  )
}
