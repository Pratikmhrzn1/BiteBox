import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Hero from '../components/Hero'
import FeaturedBites from '../components/FeaturedBites'
import LocationsSection from '../components/LocationsSection'
import MenuCustomizePopup from '../components/MenuCustomizePopup'
import {
  locationsTitle,
  locations,
  heroCopy,
  featuredTitle,
  featuredBites,
} from '../data/data'
import type { FeaturedBite } from '../data/data'
import { useCart } from '../context/CartContext'

export default function HomePage() {
  const { addItem } = useCart()
  const [selectedBite, setSelectedBite] = useState<FeaturedBite | null>(null)

  return (
    <main className="page-container">
      <div className="flex flex-col gap-8 lg:flex-row">
        <Sidebar />

        <div className="min-w-0 flex-1 lg:w-[70%]">
          <Hero copy={heroCopy} />
        </div>
      </div>

      <FeaturedBites
        title={featuredTitle}
        bites={featuredBites}
        onAdd={setSelectedBite}
      />

      <LocationsSection title={locationsTitle} locations={locations} />

      {selectedBite && (
        <MenuCustomizePopup
          item={selectedBite}
          onClose={() => setSelectedBite(null)}
          onAdd={(item, quantity, extras) => {
            addItem(item, quantity, extras)
            setSelectedBite(null)
          }}
        />
      )}
    </main>
  )
}