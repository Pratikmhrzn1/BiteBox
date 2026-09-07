import CategoryItem from './CategoryItem'

type CategoryCardProps = {
  /** Category names as the menu API reports them. */
  categories: string[]
}

export default function CategoryCard({ categories }: CategoryCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brown to-espresso-dark p-6 shadow-lg">
      <h2 className="font-sans text-lg font-bold tracking-widest text-cream uppercase">
        Category
      </h2>

      {categories.length === 0 ? (
        <p className="mt-4 font-sans text-sm text-cream/70">Loading categories…</p>
      ) : (
        <ul className="mt-4 space-y-1">
          {categories.map((category) => (
            <CategoryItem key={category} category={category} />
          ))}
        </ul>
      )}
    </section>
  )
}
