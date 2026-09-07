import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  categoryBurgerImg,
  categoryDrinksImg,
  categoryNachosImg,
  categorySandwichImg,
} from '../../assets'

type CategoryItemProps = {
  category: string
}

/**
 * Categories are free text on the server, so icons are matched by name and any
 * category we don't have artwork for falls back to the burger mark.
 */
const ICONS: Record<string, string> = {
  burgers: categoryBurgerImg,
  tacos: categorySandwichImg,
  sandwiches: categorySandwichImg,
  nachos: categoryNachosImg,
  sides: categoryNachosImg,
  drinks: categoryDrinksImg,
}

export default function CategoryItem({ category }: CategoryItemProps) {
  const navigate = useNavigate()
  const icon = ICONS[category.toLowerCase()] ?? categoryBurgerImg

  return (
    <li>
      <button
        type="button"
        onClick={() => navigate(`/menu?category=${encodeURIComponent(category)}`)}
        className="group flex w-full items-center justify-between rounded-chip px-4 py-3 text-left transition-colors duration-fast ease-ui hover:bg-cream/10"
      >
        <span className="flex items-center gap-3">
          <img src={icon} alt="" aria-hidden="true" className="h-5 w-5" />
          <span className="font-sans text-sm font-semibold tracking-wide text-cream uppercase group-hover:text-white">
            {category}
          </span>
        </span>
        <ChevronRight
          className="h-4 w-4 text-cream/60 transition-colors duration-fast ease-ui group-hover:text-white"
          aria-hidden="true"
        />
      </button>
    </li>
  )
}
