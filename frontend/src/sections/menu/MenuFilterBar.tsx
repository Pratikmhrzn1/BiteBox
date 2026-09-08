import { Leaf } from 'lucide-react'
import MenuSearchBar from '../../components/menu/MenuSearchBar'

import { SORT_OPTIONS } from './sortOptions'
import type { SortOption } from './sortOptions'

type MenuFilterBarProps = {
  categories: readonly string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  query: string
  onQueryChange: (query: string) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  vegOnly: boolean
  onVegOnlyChange: (vegOnly: boolean) => void
}

/* Category chips sit a step below the h-12 controls above them: they are
 * navigation, not input, and the size difference is what says so. */
const pill = (active: boolean) =>
  `inline-flex h-10 shrink-0 items-center rounded-chip px-4 font-sans text-sm font-bold shadow-comic-sm transition-[background-color,color,box-shadow,transform] duration-fast ease-ui hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${
    active
      ? 'bg-accent-red text-white'
      : 'border-2 border-ink-dark bg-white text-ink-dark hover:bg-amber'
  }`

export default function MenuFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  query,
  onQueryChange,
  sort,
  onSortChange,
  vegOnly,
  onVegOnlyChange,
}: MenuFilterBarProps) {
  return (
    <div className="sticky top-header z-30 -mx-4 mt-6 border-y-2 border-ink-dark bg-card-bg px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {/* Refine row. Every control here is h-12, and the search grows to take
          the slack - the bar used to pin one control to each edge of both
          rows and leave the middle empty. */}
      <div role="search" className="flex flex-wrap items-center gap-3">
        <MenuSearchBar query={query} onQueryChange={onQueryChange} />

        <button
          type="button"
          onClick={() => onVegOnlyChange(!vegOnly)}
          aria-pressed={vegOnly}
          className={`inline-flex h-12 shrink-0 items-center gap-2 rounded-control border-2 border-ink-dark px-4 font-sans text-sm font-bold shadow-comic-sm transition-[background-color,color,transform] duration-fast ease-ui active:scale-[0.96] ${
            vegOnly
              ? 'bg-olive text-white'
              : 'bg-white text-ink-dark hover:bg-cream'
          }`}
        >
          <Leaf className="h-4 w-4" aria-hidden="true" />
          Veg only
        </button>

        {/* The label lives inside the control's own border rather than
            floating beside it as tracked-out caps, so "Sort: Featured" reads
            as one object and lines up with everything else. */}
        <label className="inline-flex h-12 shrink-0 items-center gap-2 rounded-control border-2 border-ink-dark bg-white pl-4 pr-1 shadow-comic-sm">
          <span className="font-sans text-sm font-semibold text-ink-muted">
            Sort
          </span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="h-full cursor-pointer border-0 bg-transparent pr-2 font-sans text-sm font-bold text-ink-dark"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Browse row. */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            aria-pressed={category === activeCategory}
            className={pill(category === activeCategory)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
