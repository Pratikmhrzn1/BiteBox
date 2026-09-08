import type { Hours } from '../../data/home'

type OpeningHoursCardProps = {
  title: string
  rows: Hours[]
}

export default function OpeningHoursCard({
  title,
  rows,
}: OpeningHoursCardProps) {
  /* Was a gradient panel on shadow-lg with no border - a soft-shadow card in
   * a product whose depth is carried entirely by the ink outline and the
   * offset. On mobile it is the first surface under the hero, so it was the
   * loudest exception in the system. */
  return (
    <section className="rounded-panel border-2 border-ink-dark bg-gradient-to-br from-olive-deep to-espresso-dark p-6 text-cream shadow-comic-md">
      <h2 className="font-sans text-lg font-bold tracking-widest uppercase">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-3 border-t border-cream/20 pt-3 first:border-t-0 first:pt-0"
          >
            <span className="font-sans text-sm font-semibold tracking-wide uppercase">
              {row.label}
            </span>
            <span className="font-sans text-sm font-medium text-cream">
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}