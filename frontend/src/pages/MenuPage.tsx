import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { menuCategories, menuItems } from '../data/menu'
import type { MenuItem } from '../data/menu'
import MenuItemCard from '../components/MenuItemCard'
import MenuCustomizePopup from '../components/MenuCustomizePopup'
import { useCart } from '../context/CartContext'

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory =
    menuCategories.find(
      (category) => category === searchParams.get('category'),
    ) ?? 'All'
  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const { addItem } = useCart()

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory
      const matchesQuery =
        normalizedQuery === '' ||
        item.name.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  return (
    <main className="page-container">
      <div className="pb-16">
        <div className="mx-auto w-full">
          <h1 className="section-heading text-4xl sm:text-5xl">
            Our Menu
          </h1>

          <div className="sticky top-[68px] z-30 -mx-4 mt-6 border-y-2 border-ink-dark bg-card-bg px-4 py-3 sm:-mx-6 sm:px-6 lg:top-16 lg:-mx-8 lg:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {menuCategories.map((category) => {
                  const isActive = category === activeCategory
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        setSearchParams(category === 'All' ? {} : { category })
                      }
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

              <div className="relative w-full shrink-0 md:ml-auto md:w-48 lg:w-52">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search menu..."
                  className="w-full rounded-lg border-2 border-ink-dark bg-white py-2 pl-9 pr-3 font-sans text-sm font-medium text-ink-dark shadow-[3px_3px_0_#241A12] outline-none placeholder:text-ink-muted focus:bg-amber/20"
                />
              </div>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <p className="mt-12 text-center font-sans text-lg font-medium text-ink-muted">
              No items found — try a different search or category.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onAdd={setSelectedItem} />
              ))}
            </div>
          )}
        </div>

        {selectedItem && (
          <MenuCustomizePopup
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAdd={(item, quantity, extras) => {
              addItem(item, quantity, extras)
              setSelectedItem(null)
            }}
          />
        )}
      </div>
    </main>
  )
}