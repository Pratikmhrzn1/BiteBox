import type { MenuItem } from '../../api/menu'
import StarRating from '../common/StarRating'
import { formatPrice } from '../../utils'

type MenuItemCardProps = {
  item: MenuItem
  onAdd: (item: MenuItem) => void
}

export default function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  const hasOptions = item.sizes.length > 1 || item.extras.length > 0

  return (
    <article className="card-comic flex flex-col overflow-hidden rounded-xl transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#241A12]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[10px]">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />

        {item.bestSeller && (
          <span className="absolute left-3 top-3 rounded-full border-2 border-ink-dark bg-amber px-3 py-1 font-sans text-xs font-bold text-ink-dark uppercase shadow-[2px_2px_0_#241A12]">
            Best Seller
          </span>
        )}

        <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
          {item.spicy && (
            <span
              className="rounded-full border-2 border-ink-dark bg-accent-red px-2 py-0.5 font-sans text-[10px] font-bold text-white uppercase shadow-[2px_2px_0_#241A12]"
              title="Spicy"
            >
              🌶️ Spicy
            </span>
          )}
          {item.vegetarian && (
            <span
              className="rounded-full border-2 border-ink-dark bg-olive px-2 py-0.5 font-sans text-[10px] font-bold text-white uppercase shadow-[2px_2px_0_#241A12]"
              title="Vegetarian"
            >
              🌿 Veg
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-sans text-base font-bold leading-snug text-ink-dark sm:text-lg">
            {item.name}
          </h3>
        </div>

        {item.reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={item.rating} size="sm" />
            <span className="font-sans text-xs font-semibold text-ink-muted">
              {item.rating.toFixed(1)} ({item.reviewCount})
            </span>
          </div>
        )}

        <p className="line-clamp-2 text-sm font-normal leading-snug text-ink-muted">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="shrink-0 font-sans text-base font-bold text-accent-red sm:text-xl">
            {item.sizes.length > 1 ? 'from ' : ''}
            {formatPrice(item.price)}
          </span>
          <button
            type="button"
            onClick={() => onAdd(item)}
            className="shrink-0 whitespace-nowrap rounded-lg bg-accent-red px-3 py-1.5 font-sans text-xs font-bold text-white shadow-[3px_3px_0_#241A12] transition hover:-translate-y-0.5 hover:bg-red-700 active:translate-y-0 active:shadow-none sm:px-4 sm:py-2 sm:text-sm"
          >
            {hasOptions ? 'Customize' : '+ Add'}
          </button>
        </div>
      </div>
    </article>
  )
}
