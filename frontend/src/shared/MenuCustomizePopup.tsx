import { useEffect, useRef, useState } from 'react'
import { Check, Flame, Leaf, Minus, Plus, X } from 'lucide-react'
import type { MenuItem, MenuOption } from '../api/menu'
import StarRating from '../components/common/StarRating'
import { formatPrice } from '../utils'
import { buttonClass } from '../components/common/Button'
import { unsplashSrcSet } from '../data/images'
import { useFocusTrap } from '../hooks/useFocusTrap'

type MenuCustomizePopupProps = {
  item: MenuItem
  onClose: () => void
  onAdd: (
    item: MenuItem,
    quantity: number,
    options: { size: MenuOption | null; extras: MenuOption[] },
  ) => void
}

export default function MenuCustomizePopup({
  item,
  onClose,
  onAdd,
}: MenuCustomizePopupProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([])
  const [selectedSize, setSelectedSize] = useState<MenuOption | null>(
    item.sizes.length > 1 ? item.sizes[0] : null,
  )

  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useFocusTrap(dialogRef)

  // Callers pass onClose as an inline arrow, so its identity changes on every
  // parent render. Reading it through a ref keeps the effect below mount-only.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    // Opening a dialog without moving focus leaves keyboard users behind it,
    // and closing without restoring drops them at the top of the document.
    returnFocusRef.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      returnFocusRef.current?.focus()
    }
    // Mount and unmount only: re-running would pull focus out of the dialog
    // and back to the close button mid-interaction.
  }, [])

  const toggleExtra = (id: string) => {
    setSelectedExtraIds((current) =>
      current.includes(id)
        ? current.filter((extraId) => extraId !== id)
        : [...current, id],
    )
  }

  const selectedExtras = item.extras.filter((extra) =>
    selectedExtraIds.includes(extra.id),
  )
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0)
  const unitPrice = selectedSize?.price ?? item.price
  const total = (unitPrice + extrasTotal) * quantity

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-ink-dark/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="card-comic animate-pop-in max-h-[90vh] w-full max-w-md overflow-y-auto rounded-card shadow-comic-lg"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${item.name}`}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            srcSet={unsplashSrcSet(item.image)}
            sizes="(min-width: 640px) 28rem, 92vw"
            alt={item.name}
            decoding="async"
            className="h-full w-full object-cover"
          />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink-dark bg-card-bg text-ink-dark shadow-comic-xs transition-[background-color,transform] duration-fast ease-ui hover:bg-amber active:scale-[0.96]"
            aria-label="Close customization"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {item.spicy && (
              <span className="rounded-full border-2 border-ink-dark bg-accent-red px-2 py-0.5 font-sans text-[10px] font-bold text-white uppercase">
                <Flame className="h-3 w-3" aria-hidden="true" /> Spicy
              </span>
            )}
            {item.vegetarian && (
              <span className="rounded-full border-2 border-ink-dark bg-olive px-2 py-0.5 font-sans text-[10px] font-bold text-white uppercase">
                <Leaf className="h-3 w-3" aria-hidden="true" /> Veg
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-display-xs text-header-brown">{item.name}</h3>
              <span className="shrink-0 font-sans text-xl font-bold text-accent-red">
                {formatPrice(unitPrice)}
              </span>
            </div>
            <p className="mt-1 font-sans text-body-lg text-ink-muted">
              {item.description}
            </p>
            {item.reviewCount > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={item.rating} size="sm" />
                <span className="font-sans text-xs font-semibold text-ink-muted">
                  {item.rating.toFixed(1)} · {item.reviewCount} review
                  {item.reviewCount === 1 ? '' : 's'}
                </span>
              </div>
            )}
          </div>

          {item.sizes.length > 1 && (
            <div>
              <p className="font-sans text-sm font-bold uppercase text-ink-dark">
                Size
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {item.sizes.map((size) => {
                  const isActive = selectedSize?.id === size.id
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={isActive}
                      className={`flex min-h-11 items-center justify-between rounded-chip border-2 border-ink-dark px-3 py-2 text-left transition-[background-color,transform] duration-fast ease-ui active:scale-[0.96] ${
                        isActive ? 'bg-amber' : 'bg-white hover:bg-cream/50'
                      }`}
                    >
                      <span className="font-sans text-sm font-bold text-ink-dark">
                        {size.label}
                      </span>
                      <span className="font-sans text-sm font-bold text-ink-muted">
                        {formatPrice(size.price)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {item.extras.length > 0 && (
            <div>
              <p className="font-sans text-sm font-bold uppercase text-ink-dark">
                Extras
              </p>
              <ul className="mt-2 space-y-2">
                {item.extras.map((extra) => {
                  const isSelected = selectedExtraIds.includes(extra.id)
                  return (
                    <li key={extra.id}>
                      <button
                        type="button"
                        onClick={() => toggleExtra(extra.id)}
                        aria-pressed={isSelected}
                        className={`flex min-h-11 w-full items-center justify-between rounded-chip border-2 border-ink-dark px-3 py-2 text-left transition-[background-color,transform] duration-fast ease-ui active:scale-[0.98] ${
                          isSelected ? 'bg-amber' : 'bg-white hover:bg-cream/50'
                        }`}
                      >
                        <span className="flex items-center gap-2 font-sans text-sm font-medium text-ink-dark">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded border-2 border-ink-dark ${
                              isSelected ? 'bg-accent-red' : 'bg-white'
                            }`}
                            aria-hidden="true"
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </span>
                          {extra.label}
                        </span>
                        <span className="font-sans text-sm font-bold text-ink-muted">
                          +{formatPrice(extra.price)}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-sans text-sm font-bold uppercase text-ink-dark">
              Quantity
            </span>
            <div className="flex items-center rounded-full border-2 border-ink-dark bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-dark transition-[color,transform] duration-fast ease-ui hover:text-accent-red active:scale-[0.96]"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="nums min-w-6 text-center font-sans text-lg font-bold text-ink-dark">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-dark transition-[color,transform] duration-fast ease-ui hover:text-accent-red active:scale-[0.96]"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onAdd(item, quantity, {
                size: selectedSize,
                extras: selectedExtras,
              })
            }
            className={buttonClass({ size: 'lg', className: 'w-full justify-between' })}
          >
            <span>Add to Cart</span>
            <span className="font-display text-base">{formatPrice(total)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
