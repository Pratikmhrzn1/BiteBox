import MenuSearchBar from '../../components/menu/MenuSearchBar'

import { SORT_OPTIONS } from './sortOptions'
import type { SortOption } from './sortOptions'
import { Leaf } from 'lucide-react'

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

const pill = (active: boolean) =>
  active
    ? 'shrink-0 rounded-chip bg-accent-red px-4 py-2 font-sans text-sm font-bold text-white shadow-comic-sm transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-ui hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'
    : 'shrink-0 rounded-chip border-2 border-ink-dark bg-white px-4 py-2 font-sans text-sm font-bold text-ink-dark shadow-comic-sm transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-ui hover:-translate-y-0.5 hover:bg-amber active:translate-y-0 active:shadow-none'

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
    <div className="sticky top-header z-30 -mx-4 mt-6 border-y-2 border-ink-dark bg-card-bg px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

        <MenuSearchBar query={query} onQueryChange={onQueryChange} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onVegOnlyChange(!vegOnly)}
          aria-pressed={vegOnly}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-chip border-2 border-ink-dark px-3 font-sans text-xs font-bold uppercase shadow-comic-xs transition-[background-color,transform] duration-fast ease-ui active:scale-[0.96] ${
            vegOnly ? 'bg-olive text-white' : 'bg-white text-ink-dark hover:bg-cream'
          }`}
        >
          <Leaf className="h-3.5 w-3.5" aria-hidden="true" /> Veg only
        </button>

        <label className="ml-auto flex items-center gap-2 font-sans text-xs font-bold uppercase text-ink-muted">
          Sort
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="cursor-pointer rounded-chip border-2 border-ink-dark bg-white px-3 py-1.5 font-sans text-xs font-bold text-ink-dark shadow-comic-xs"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
