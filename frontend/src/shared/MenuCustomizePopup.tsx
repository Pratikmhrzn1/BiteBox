import { useEffect, useState } from 'react'
import { Check, Minus, Plus, X } from 'lucide-react'
import type { CartExtra } from '../data/menu'
import { CART_EXTRAS } from '../data/menu'
import type { CartAddInput } from '../context/CartContext'
import { formatPrice } from '../utils'

type MenuCustomizePopupProps = {
  item: CartAddInput
  onClose: () => void
  onAdd: (item: CartAddInput, quantity: number, extras: CartExtra[]) => void
}

export default function MenuCustomizePopup({
  item,
  onClose,
  onAdd,
}: MenuCustomizePopupProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])

  const toggleExtra = (id: string) => {
    setSelectedExtras((current) =>
      current.includes(id)
        ? current.filter((extraId) => extraId !== id)
        : [...current, id],
    )
  }

  const selectedExtraObjects = CART_EXTRAS.filter((extra) =>
    selectedExtras.includes(extra.id),
  )

  const extrasTotal = selectedExtraObjects.reduce(
    (sum, extra) => sum + extra.price,
    0,
  )

  const total = (item.price + extrasTotal) * quantity

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleAdd = () => {
    onAdd(item, quantity, selectedExtraObjects)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-dark/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="card-comic w-full max-w-md overflow-hidden rounded-2xl shadow-[8px_8px_0_#241A12]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${item.name}`}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full border-2 border-ink-dark bg-card-bg p-1.5 text-ink-dark shadow-[2px_2px_0_#241A12] transition hover:bg-amber"
            aria-label="Close customization"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl text-header-brown">
              {item.name}
            </h3>
            <span className="font-sans text-xl font-bold text-accent-red">
              {formatPrice(item.price)}
            </span>
          </div>

<div>
              <p className="font-sans text-sm font-bold uppercase text-ink-dark">
                Extras
              </p>
              <ul className="mt-2 space-y-2">
                {CART_EXTRAS.map((extra) => {
                  const isSelected = selectedExtras.includes(extra.id)
                  return (
                    <li key={extra.id}>
                      <button
                        type="button"
                        onClick={() => toggleExtra(extra.id)}
                        className={`flex w-full items-center justify-between rounded-lg border-2 border-ink-dark px-3 py-2 text-left transition ${
                          isSelected ? 'bg-amber' : 'bg-white'
                        }`}
                      >
                        <span className="flex items-center gap-2 font-sans text-sm font-medium text-ink-dark">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded border-2 border-ink-dark ${
                              isSelected ? 'bg-accent-red' : 'bg-white'
                            }`}
                            aria-hidden="true"
                          >
                            {isSelected && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </span>
                          {extra.label}
                        </span>
                        <span className="font-sans text-sm font-bold text-ink-muted">
                          + Rs {extra.price}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

          <div className="flex items-center justify-between">
            <span className="font-sans text-sm font-bold uppercase text-ink-dark">
              Quantity
            </span>
            <div className="flex items-center gap-3 rounded-full border-2 border-ink-dark bg-white px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-ink-dark transition hover:text-accent-red"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-6 text-center font-sans text-lg font-bold text-ink-dark">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="text-ink-dark transition hover:text-accent-red"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="btn-comic-red w-full justify-between px-5 py-3 text-lg"
          >
            <span>Add to Cart</span>
            <span className="font-display text-base">{formatPrice(total)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}