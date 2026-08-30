import type { Category } from '../../data/data'
import CategoryItem from './CategoryItem'

type CategoryCardProps = {
  categories: Category[]
}

export default function CategoryCard({ categories }: CategoryCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brown to-espresso-dark p-6 shadow-lg">
      <h2 className="font-sans text-lg font-bold tracking-widest text-cream uppercase">
        Category
      </h2>

      <ul className="mt-4 space-y-1">
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </ul>
    </section>
  )
}