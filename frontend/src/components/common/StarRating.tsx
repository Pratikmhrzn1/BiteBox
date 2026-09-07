import { Star } from 'lucide-react'

type StarRatingProps = {
  rating: number
  /** Renders clickable stars and reports the chosen value. */
  onChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const SIZES = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-7 w-7' } as const

export default function StarRating({
  rating,
  onChange,
  size = 'md',
  label,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5]
  const iconClass = SIZES[size]

  if (!onChange) {
    return (
      <span
        className="inline-flex items-center gap-0.5"
        aria-label={label ?? `Rated ${rating} out of 5`}
      >
        {stars.map((star) => (
          <Star
            key={star}
            className={`${iconClass} ${
              star <= Math.round(rating) ? 'text-amber' : 'text-ink-muted/35'
            }`}
            fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        ))}
      </span>
    )
  }

  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label={label ?? 'Rating'}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === rating}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          onClick={() => onChange(star)}
          className="tap-target rounded transition-transform duration-fast ease-ui hover:scale-110 active:scale-[0.96]"
        >
          <Star
            className={`${iconClass} ${star <= rating ? 'text-amber' : 'text-ink-muted/35'}`}
            fill={star <= rating ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  )
}
