import { openingHours, categories } from '../../data/data'
import OpeningHoursCard from '../../components/home/OpeningHoursCard'
import CategoryCard from '../../components/home/CategoryCard'

export default function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[30%]">
      <OpeningHoursCard
        title={openingHours.title}
        rows={openingHours.rows}
      />
      <CategoryCard categories={categories} />
    </aside>
  )
}