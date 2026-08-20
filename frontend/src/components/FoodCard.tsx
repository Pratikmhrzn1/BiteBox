import type { FeaturedBite } from '../data/data'
import { formatPrice } from '../utils'

type FoodCardProps = {
  bite: FeaturedBite
  onAdd?: (bite: FeaturedBite) => void
}

export default function FoodCard({ bite, onAdd }: FoodCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-card-bg shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        <img
          src={bite.image}
          alt={bite.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute right-4 top-4 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-accent-red text-center leading-tight text-white uppercase shadow-md">
          <span className="text-[9px] font-bold tracking-wide">Best</span>
          <span className="text-[9px] font-bold tracking-wide">Bite</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-sans text-lg font-bold leading-snug text-ink-dark">
          {bite.name}
        </h3>
        <p className="truncate text-sm font-normal text-ink-muted">
          {bite.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="font-sans text-xl font-bold text-accent-red">
            {formatPrice(bite.price)}
          </span>
          <button
            type="button"
            onClick={() => onAdd?.(bite)}
            className="rounded-full bg-accent-red px-5 py-2 font-sans text-sm font-bold text-white shadow-md transition hover:bg-red-700"
          >
            Add +
          </button>
        </div>
      </div>
    </article>
  )
}