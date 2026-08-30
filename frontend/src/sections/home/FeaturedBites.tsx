import { Link } from 'react-router'
import type { FeaturedBite } from '../../data/data'
import FoodCard from '../../components/home/FoodCard'
import SectionHeading from '../../components/common/SectionHeading'

type FeaturedBitesProps = {
  title: string
  bites: FeaturedBite[]
  onAdd?: (bite: FeaturedBite) => void
}

export default function FeaturedBites({
  title,
  bites,
  onAdd,
}: FeaturedBitesProps) {
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading>{title}</SectionHeading>
        <span className="font-sans text-sm font-semibold text-accent-red">
          <Link to="/menu">See full menu →</Link>
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bites.map((bite) => (
          <FoodCard key={bite.id} bite={bite} onAdd={onAdd} />
        ))}
      </div>
    </section>
  )
}