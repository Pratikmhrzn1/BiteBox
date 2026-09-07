import { Link } from 'react-router-dom'
import type { MenuItem } from '../../api/menu'
import FoodCard from '../../components/home/FoodCard'
import SectionHeading from '../../components/common/SectionHeading'

type FeaturedBitesProps = {
  title: string
  items: MenuItem[]
  loading?: boolean
  onAdd?: (item: MenuItem) => void
}

export default function FeaturedBites({
  title,
  items,
  loading = false,
  onAdd,
}: FeaturedBitesProps) {
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading>{title}</SectionHeading>
        <Link
          to="/menu"
          className="font-sans text-sm font-semibold text-accent-red hover:underline"
        >
          See full menu →
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-card-bg shadow-lg"
                aria-hidden="true"
              >
                <div className="aspect-[4/3] animate-pulse bg-ink-muted/20" />
                <div className="space-y-2 p-4">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-ink-muted/20" />
                  <div className="h-3 w-full animate-pulse rounded bg-ink-muted/15" />
                  <div className="h-8 w-full animate-pulse rounded bg-ink-muted/15" />
                </div>
              </div>
            ))
          : items.map((item) => (
              <FoodCard key={item.id} item={item} onAdd={onAdd} />
            ))}
      </div>
    </section>
  )
}
