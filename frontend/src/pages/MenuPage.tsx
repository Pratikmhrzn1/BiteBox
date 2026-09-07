import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { MenuItem } from '../api/menu'
import DishCard, { DishCardSkeleton } from '../components/menu/DishCard'
import MenuFilterBar from '../sections/menu/MenuFilterBar'
import type { SortOption } from '../sections/menu/sortOptions'
import MenuCustomizePopup from '../shared/MenuCustomizePopup'
import { EmptyState, ErrorState } from '../components/common/States'
import { useToast } from '../components/common/Toast'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { buttonClass } from '../components/common/Button'

export default function MenuPage() {
  const { menu, categories, loading, error, reloadMenu } = useStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('featured')
  const [vegOnly, setVegOnly] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const { addItem, openCart } = useCart()
  const { notify } = useToast()

  const allCategories = useMemo(() => ['All', ...categories], [categories])

  const activeCategory =
    allCategories.find((category) => category === searchParams.get('category')) ??
    'All'

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const matches = menu.filter((item) => {
      if (activeCategory !== 'All' && item.category !== activeCategory) return false
      if (vegOnly && !item.vegetarian) return false
      if (!normalizedQuery) return true
      return (
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery)
      )
    })

    switch (sort) {
      case 'price-asc':
        return [...matches].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...matches].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...matches].sort((a, b) => b.rating - a.rating)
      default:
        // "Featured" keeps the server's ordering but floats best sellers up.
        return [...matches].sort(
          (a, b) => Number(b.bestSeller) - Number(a.bestSeller),
        )
    }
  }, [menu, activeCategory, query, sort, vegOnly])

  return (
    <main className="page-container">
      <div className="pb-16">
        <div className="mx-auto w-full">
          <h1 className="section-heading text-display-lg">Our Menu</h1>
          <p className="mt-1 font-sans text-body-lg text-ink-muted">
            {loading
              ? 'Loading the good stuff…'
              : `${menu.length} dishes, smashed to order.`}
          </p>

          <MenuFilterBar
            categories={allCategories}
            activeCategory={activeCategory}
            onCategoryChange={(category) =>
              setSearchParams(category === 'All' ? {} : { category })
            }
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
            vegOnly={vegOnly}
            onVegOnlyChange={setVegOnly}
          />

          {loading ? (
            <div className="dish-grid mt-8" aria-busy="true">
              {Array.from({ length: 8 }, (_, index) => (
                <DishCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={reloadMenu} />
          ) : filteredItems.length === 0 ? (
            <EmptyState
              title="Nothing matches that"
              hint="Try a different search, category, or clear the veg-only filter."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setVegOnly(false)
                    setSearchParams({})
                  }}
                  className={buttonClass({ size: 'sm' })}
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <div className="dish-grid mt-8">
              {filteredItems.map((item) => (
                <DishCard key={item.id} item={item} onAdd={setSelectedItem} />
              ))}
            </div>
          )}
        </div>

        {selectedItem && (
          <MenuCustomizePopup
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAdd={(item, quantity, options) => {
              addItem(item, quantity, options)
              setSelectedItem(null)
              notify(`${quantity}× ${item.name} added to your box`)
              openCart()
            }}
          />
        )}
      </div>
    </main>
  )
}
