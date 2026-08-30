import type { MenuItem } from '../../data/menu'
import { formatPrice } from '../../utils'

type MenuItemCardProps = {
  item: MenuItem
  onAdd: (item: MenuItem) => void
}

export default function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  return (
    <article className="card-comic flex flex-col overflow-hidden rounded-xl transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#241A12]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[10px]">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {item.bestSeller && (
          <span className="absolute left-3 top-3 rounded-full border-2 border-ink-dark bg-amber px-3 py-1 font-sans text-xs font-bold text-ink-dark uppercase shadow-[2px_2px_0_#241A12]">
            Best Seller
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
        <h3 className="font-sans text-base font-bold leading-snug text-ink-dark sm:text-lg">
          {item.name}
        </h3>
        <p className="line-clamp-2 text-sm font-normal leading-snug text-ink-muted">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="shrink-0 font-sans text-base font-bold text-accent-red sm:text-xl">
            {formatPrice(item.price)}
          </span>
          <button
            type="button"
            onClick={() => onAdd(item)}
            className="shrink-0 whitespace-nowrap rounded-lg bg-accent-red px-3 py-1.5 font-sans text-xs font-bold text-white shadow-[3px_3px_0_#241A12] transition hover:-translate-y-0.5 hover:bg-red-700 active:translate-y-0 active:shadow-none sm:px-4 sm:py-2 sm:text-sm"
          >
            + Add
          </button>
        </div>
      </div>
    </article>
  )
}