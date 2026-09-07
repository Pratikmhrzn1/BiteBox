import type { MenuItem } from '../../api/menu'
import Button from '../common/Button'
import StarRating from '../common/StarRating'
import { formatPrice } from '../../utils'
import { unsplashSrcSet } from '../../data/images'
import { Flame, Leaf } from 'lucide-react'

/**
 * One dish, one card.
 *
 * The home page and the menu page used to render the same dish through two
 * unrelated components: FoodCard (soft shadow, no border, circular "Best
 * Bite" badge, pill button) and MenuItemCard (comic border, offset shadow,
 * "Best Seller" pill, small square button). They disagreed on radius,
 * elevation, badge shape, button size and which dietary flags to show.
 *
 * This is the comic treatment, which is the system the rest of the product
 * uses. The soft-shadow variant was the outlier.
 */
type DishCardProps = {
  item: MenuItem
  onAdd?: (item: MenuItem) => void
}

export default function DishCard({ item, onAdd }: DishCardProps) {
  const hasOptions = item.sizes.length > 1 || item.extras.length > 0

  return (
    <article className="card-comic group flex flex-col overflow-hidden rounded-card transition-[transform,box-shadow] duration-base ease-ui hover:-translate-y-0.5 hover:shadow-comic-md">
      {/* overflow-hidden on the article clips to the padding box, so the
          image corners stay concentric with the 2px border for free. */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          srcSet={unsplashSrcSet(item.image)}
          sizes="(min-width: 1280px) 20rem, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          alt={item.name}
          loading="lazy"
          decoding="async"
          /* group-hover, not hover: on the img itself. Previously the zoom
             only fired while the cursor was over the image, so the card
             lifted and the image sat still. */
          className="h-full w-full object-cover transition-transform duration-slow ease-ui group-hover:scale-105"
        />

        {item.bestSeller && (
          <span className="absolute left-3 top-3 rounded-full border-2 border-ink-dark bg-amber px-3 py-1 font-sans text-xs font-bold uppercase text-ink-dark shadow-comic-xs">
            Best seller
          </span>
        )}

        <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
          {item.spicy && (
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink-dark bg-accent-red px-2 py-0.5 font-sans text-[10px] font-bold uppercase text-white shadow-comic-xs">
              <Flame className="h-3 w-3" aria-hidden="true" /> Spicy
            </span>
          )}
          {item.vegetarian && (
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink-dark bg-olive px-2 py-0.5 font-sans text-[10px] font-bold uppercase text-white shadow-comic-xs">
              <Leaf className="h-3 w-3" aria-hidden="true" /> Veg
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-sans text-lg font-bold leading-snug text-ink-dark">
          {item.name}
        </h3>

        {item.reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={item.rating} size="sm" />
            <span className="nums font-sans text-xs font-semibold text-ink-muted">
              {item.rating.toFixed(1)} ({item.reviewCount})
            </span>
          </div>
        )}

        <p className="line-clamp-2 text-body leading-snug text-ink-muted">
          {item.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <span className="nums font-sans text-xl font-bold text-accent-red">
            {item.sizes.length > 1 && (
              <span className="font-sans text-sm font-semibold text-ink-muted">
                from{' '}
              </span>
            )}
            {formatPrice(item.price)}
          </span>
          <Button size="sm" onClick={() => onAdd?.(item)}>
            {hasOptions ? 'Customize' : 'Add'}
          </Button>
        </div>
      </div>
    </article>
  )
}

/**
 * Matches DishCard's own structure, so the layout does not shift when real
 * dishes arrive. The two skeletons this replaces had different grids, radii
 * and elevation from each other and from the cards they stood in for.
 */
export function DishCardSkeleton() {
  return (
    <div className="card-comic overflow-hidden rounded-card" aria-hidden="true">
      <div className="aspect-[4/3] animate-pulse bg-ink-muted/20" />
      <div className="space-y-2.5 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-ink-muted/20" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-ink-muted/15" />
        <div className="h-3 w-full animate-pulse rounded bg-ink-muted/15" />
        <div className="flex items-center justify-between pt-3">
          <div className="h-6 w-20 animate-pulse rounded bg-ink-muted/20" />
          <div className="h-11 w-24 animate-pulse rounded-control bg-ink-muted/15" />
        </div>
      </div>
    </div>
  )
}
