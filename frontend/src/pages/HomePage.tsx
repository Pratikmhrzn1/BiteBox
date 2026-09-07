import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MenuItem } from '../api/menu'
import Sidebar from '../sections/home/Sidebar'
import Hero from '../sections/home/Hero'
import FeaturedBites from '../sections/home/FeaturedBites'
import LocationsSection from '../sections/home/LocationsSection'
import ReviewsSection from '../sections/home/ReviewsSection'
import MenuCustomizePopup from '../shared/MenuCustomizePopup'
import { useToast } from '../components/common/Toast'
import { locations, locationsTitle } from '../data/home'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { readableInkOn } from '../utils'

export default function HomePage() {
  const navigate = useNavigate()
  const { menu, categories, content, loading } = useStore()
  const { addItem, openCart } = useCart()
  const { notify } = useToast()
  const [selected, setSelected] = useState<MenuItem | null>(null)

  /** Best sellers lead; top-rated dishes fill the row when there are few. */
  const featured = useMemo(() => {
    const bestSellers = menu.filter((item) => item.bestSeller)
    const rest = menu
      .filter((item) => !item.bestSeller)
      .sort((a, b) => b.rating - a.rating)
    return [...bestSellers, ...rest].slice(0, 4)
  }, [menu])

  const openingHours = {
    title: content.openingHours.title,
    rows: content.openingHours.rows.map((row) => ({
      label: row.label,
      value:
        row.closed || !row.from || !row.to ? 'Closed' : `${row.from} – ${row.to}`,
    })),
  }

  return (
    <main className="page-container">
      {content.announcement.enabled && content.announcement.text && (
        <div
          className="mb-6 rounded-card border-2 border-ink-dark px-4 py-3 text-center font-sans text-sm font-bold shadow-comic"
          style={{
            backgroundColor: content.announcement.color,
            color: readableInkOn(content.announcement.color),
          }}
          role="status"
        >
          {content.announcement.text}
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        <Sidebar openingHours={openingHours} categories={categories} />

        <div className="min-w-0 flex-1 lg:w-[70%]">
          <Hero copy={content.hero} onCta={() => navigate('/menu')} />
        </div>
      </div>

      <FeaturedBites
        title="Featured Bites"
        items={featured}
        loading={loading}
        onAdd={setSelected}
      />

      <ReviewsSection />

      <LocationsSection title={locationsTitle} locations={locations} />

      {selected && (
        <MenuCustomizePopup
          item={selected}
          onClose={() => setSelected(null)}
          onAdd={(item, quantity, options) => {
            addItem(item, quantity, options)
            setSelected(null)
            notify(`${quantity}× ${item.name} added to your box`)
            openCart()
          }}
        />
      )}
    </main>
  )
}
