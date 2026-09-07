import { cartLineTotal, type CartItem } from '../../context/CartContext'
import { formatPrice } from '../../utils'
import { unsplashAt } from '../../data/images'

type CheckoutItemRowProps = {
  item: CartItem
}

export default function CheckoutItemRow({ item }: CheckoutItemRowProps) {
  const options = [
    ...(item.size ? [item.size.label] : []),
    ...item.extras.map((extra) => extra.label),
  ]

  return (
    <li className="flex items-center gap-3 rounded-control border-2 border-ink-dark bg-white p-3">
      <img
        src={unsplashAt(item.image, 96)}
        alt={item.name}
        loading="lazy"
        decoding="async"
        className="h-12 w-12 shrink-0 rounded-chip object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="font-sans text-sm font-bold text-ink-dark">
          {item.name} × {item.quantity}
        </p>
        {options.length > 0 && (
          <p className="mt-0.5 truncate font-sans text-xs font-medium text-ink-muted">
            {options.join(', ')}
          </p>
        )}
      </div>
      <span className="shrink-0 font-sans text-sm font-bold text-accent-red">
        {formatPrice(cartLineTotal(item))}
      </span>
    </li>
  )
}
