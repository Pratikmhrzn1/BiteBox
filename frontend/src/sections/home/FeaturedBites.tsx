import { Link } from 'react-router-dom'
import type { MenuItem } from '../../api/menu'
import DishCard, { DishCardSkeleton } from '../../components/menu/DishCard'
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
    <section className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading>{title}</SectionHeading>
        <Link
          to="/menu"
          className="font-sans text-sm font-semibold text-accent-red underline-offset-4 hover:underline"
        >
          See full menu
        </Link>
      </div>

      <div className="dish-grid mt-6" aria-busy={loading}>
        {loading
          ? Array.from({ length: 4 }, (_, index) => (
              <DishCardSkeleton key={index} />
            ))
          : items.map((item) => (
              <DishCard key={item.id} item={item} onAdd={onAdd} />
            ))}
      </div>
    </section>
  )
}
