import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { menuCategories, menuItems } from '../data/menu'
import type { MenuItem } from '../data/menu'
import MenuItemCard from '../components/menu/MenuItemCard'
import MenuFilterBar from '../sections/menu/MenuFilterBar'
import MenuCustomizePopup from '../shared/MenuCustomizePopup'
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

          <MenuFilterBar
            categories={menuCategories}
            activeCategory={activeCategory}
            onCategoryChange={(category) =>
              setSearchParams(category === 'All' ? {} : { category })
            }
            query={query}
            onQueryChange={setQuery}
          />

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