import type { MenuItem } from '../../api/menu'
import StarRating from '../common/StarRating'
import { formatPrice } from '../../utils'

type FoodCardProps = {
  item: MenuItem
  onAdd?: (item: MenuItem) => void
}

export default function FoodCard({ item, onAdd }: FoodCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-card-bg shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
        {item.bestSeller && (
          <span className="absolute right-4 top-4 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-accent-red text-center leading-tight text-white uppercase shadow-md">
            <span className="text-[9px] font-bold tracking-wide">Best</span>
            <span className="text-[9px] font-bold tracking-wide">Bite</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-sans text-lg font-bold leading-snug text-ink-dark">
          {item.name}
        </h3>

        {item.reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={item.rating} size="sm" />
            <span className="font-sans text-xs font-semibold text-ink-muted">
              {item.rating.toFixed(1)} ({item.reviewCount})
            </span>
          </div>
        )}

        <p className="line-clamp-2 text-sm font-normal text-ink-muted">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="font-sans text-xl font-bold text-accent-red">
            {formatPrice(item.price)}
          </span>
          <button
            type="button"
            onClick={() => onAdd?.(item)}
            className="rounded-full bg-accent-red px-5 py-2 font-sans text-sm font-bold text-white shadow-md transition hover:bg-red-700"
          >
            Add +
          </button>
        </div>
      </div>
    </article>
  )
}
