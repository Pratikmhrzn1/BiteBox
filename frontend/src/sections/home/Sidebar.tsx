import type { Hours } from '../../data/home'
import OpeningHoursCard from '../../components/home/OpeningHoursCard'
import CategoryCard from '../../components/home/CategoryCard'

type SidebarProps = {
  openingHours: { title: string; rows: Hours[] }
  categories: string[]
}

export default function Sidebar({ openingHours, categories }: SidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 lg:order-first lg:w-[30%]">
      <OpeningHoursCard title={openingHours.title} rows={openingHours.rows} />
      <CategoryCard categories={categories} />
    </aside>
  )
}
