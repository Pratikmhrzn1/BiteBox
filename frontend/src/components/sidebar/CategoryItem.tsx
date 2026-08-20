import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Category } from '../../data/data'

type CategoryItemProps = {
  category: Category
}

export default function CategoryItem({ category }: CategoryItemProps) {
  const navigate = useNavigate()

  return (
    <li>
      <button
        type="button"
        onClick={() =>
          navigate(`/menu?category=${encodeURIComponent(category.label)}`)
        }
        className="group flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition hover:bg-cream/10"
      >
        <span className="flex items-center gap-3">
          <img
            src={category.icon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5"
          />
          <span className="font-sans text-sm font-semibold tracking-wide text-cream uppercase group-hover:text-white">
            {category.label}
          </span>
        </span>
        <ChevronRight
          className="h-4 w-4 text-cream/60 transition group-hover:text-white"
          aria-hidden="true"
        />
      </button>
    </li>
  )
}