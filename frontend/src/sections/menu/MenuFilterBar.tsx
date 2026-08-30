import MenuSearchBar from '../../components/menu/MenuSearchBar'

type MenuFilterBarProps = {
  categories: readonly string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  query: string
  onQueryChange: (query: string) => void
}

export default function MenuFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  query,
  onQueryChange,
}: MenuFilterBarProps) {
  return (
    <div className="sticky top-[68px] z-30 -mx-4 mt-6 border-y-2 border-ink-dark bg-card-bg px-4 py-3 sm:-mx-6 sm:px-6 lg:top-16 lg:-mx-8 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => {
            const isActive = category === activeCategory
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={
                  isActive
                    ? 'shrink-0 rounded-lg bg-accent-red px-4 py-2 font-sans text-sm font-bold text-white shadow-[3px_3px_0_#241A12] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'
                    : 'shrink-0 rounded-lg border-2 border-ink-dark bg-white px-4 py-2 font-sans text-sm font-bold text-ink-dark shadow-[3px_3px_0_#241A12] transition hover:-translate-y-0.5 hover:bg-amber active:translate-y-0 active:shadow-none'
                }
              >
                {category}
              </button>
            )
          })}
        </div>

        <MenuSearchBar query={query} onQueryChange={onQueryChange} />
      </div>
    </div>
  )
}
