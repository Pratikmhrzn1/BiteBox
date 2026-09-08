import { useCallback, useState, type FormEvent } from 'react'
import { createReview, fetchReviews, fetchReviewSummary } from '../../api/reviews'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../../components/common/Toast'
import SectionHeading from '../../components/common/SectionHeading'
import StarRating from '../../components/common/StarRating'
import { fieldClass, focusFirstError, labelClass } from '../../components/common/formStyles'
import FormField from '../../components/common/FormField'
import { formatDate } from '../../utils'
import { buttonClass } from '../../components/common/Button'

type FieldErrors = Partial<Record<'authorName' | 'title' | 'body', string>>

const FIELD_ORDER = [
  ['authorName', 'review-name'],
  ['title', 'review-title'],
  ['body', 'review-body'],
] as const

export default function ReviewsSection() {
  const { user, token } = useAuth()
  const { menu } = useStore()
  const { notify } = useToast()

  const loadReviews = useCallback(() => fetchReviews(), [])
  const loadSummary = useCallback(() => fetchReviewSummary(), [])
  const reviewsState = useAsync(loadReviews)
  const summaryState = useAsync(loadSummary)

  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [form, setForm] = useState({ authorName: '', menuItem: '', title: '', body: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const reviews = (reviewsState.data ?? []).slice(0, 6)
  const summary = summaryState.data

  const updateField = (field: keyof typeof form) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: FieldErrors = {}
    if (!user && !form.authorName.trim())
      nextErrors.authorName = 'Tell us your name so we can credit the review'
    if (!form.title.trim()) nextErrors.title = 'Give it a headline'
    if (!form.body.trim()) nextErrors.body = 'Add a few words about the food'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(FIELD_ORDER, nextErrors)
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await createReview(
        {
          rating,
          title: form.title.trim(),
          body: form.body.trim(),
          ...(user ? {} : { authorName: form.authorName.trim() }),
          ...(form.menuItem ? { menuItem: form.menuItem } : {}),
        },
        token ?? undefined,
      )
      // New reviews are held for moderation, so the list will not change yet.
      notify('Thanks! Your review is awaiting approval.')
      setForm({ authorName: '', menuItem: '', title: '', body: '' })
      setErrors({})
      setRating(5)
      setOpen(false)
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Could not send your review.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Reviews are a bonus section: a failed request renders nothing rather than
  // an error the visitor cannot act on.
  if (reviewsState.error) return null

  // While loading, hold the space. Returning null here made the Locations
  // section below jump up and then back down once reviews arrived.
  if (reviewsState.loading) {
    return (
      <section className="mt-14" aria-busy="true">
        <SectionHeading>What People Say</SectionHeading>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="card-comic h-40 animate-pulse rounded-card"
              aria-hidden="true"
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionHeading>What People Say</SectionHeading>
          {summary && summary.total > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={summary.average} />
              <span className="font-sans text-sm font-bold text-ink-dark">
                {summary.average.toFixed(1)} from {summary.total} review
                {summary.total === 1 ? '' : 's'}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={buttonClass({ size: 'sm' })}
        >
          {open ? 'Close' : 'Write a review'}
        </button>
      </div>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="card-comic mt-5 space-y-4 rounded-card bg-card-bg p-5 sm:p-6"
          noValidate
        >
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className={labelClass}>Your rating</p>
              <StarRating rating={rating} onChange={setRating} size="lg" />
            </div>
            <div className="min-w-[12rem] flex-1">
              <FormField
                id="review-item"
                label="Dish"
                hint="Optional. Leave it on a general review if you like."
              >
                {(control) => (
                  <select
                    {...control}
                    value={form.menuItem}
                    onChange={(event) => updateField('menuItem')(event.target.value)}
                    className={`${fieldClass(false)} cursor-pointer`}
                  >
                    <option value="">A general review</option>
                    {menu.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                )}
              </FormField>
            </div>
          </div>

          {!user && (
            <FormField
              id="review-name"
              label="Your name"
              error={errors.authorName}
              required
            >
              {(control) => (
                <input
                  {...control}
                  type="text"
                  autoComplete="name"
                  value={form.authorName}
                  onChange={(event) => updateField('authorName')(event.target.value)}
                  placeholder="Zoe Smashburger"
                  className={fieldClass(Boolean(errors.authorName))}
                />
              )}
            </FormField>
          )}

          <FormField id="review-title" label="Headline" error={errors.title} required>
            {(control) => (
              <input
                {...control}
                type="text"
                value={form.title}
                onChange={(event) => updateField('title')(event.target.value)}
                placeholder="Best smash in Lalitpur"
                className={fieldClass(Boolean(errors.title))}
              />
            )}
          </FormField>

          <FormField id="review-body" label="Your review" error={errors.body} required>
            {(control) => (
              <textarea
                {...control}
                rows={3}
                value={form.body}
                onChange={(event) => updateField('body')(event.target.value)}
                placeholder="Tell us what you thought…"
                className={`${fieldClass(Boolean(errors.body))} resize-none`}
              />
            )}
          </FormField>

          {error && (
            <p className="font-sans text-sm font-semibold text-accent-red" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={buttonClass({ size: 'md', className: 'w-full' })}
          >
            {submitting ? 'Sending…' : 'Submit review'}
          </button>
        </form>
      )}

      {reviews.length === 0 && !open && (
        <p className="mt-6 font-sans text-sm text-ink-muted">
          No reviews yet — be the first to tell everyone what you thought.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="card-comic flex flex-col gap-2 rounded-card bg-card-bg p-5"
          >
            <StarRating rating={review.rating} size="sm" />
            <h3 className="font-sans text-base font-bold text-ink-dark">
              {review.title}
            </h3>
            <p className="font-sans text-body leading-snug text-ink-muted">
              {review.body}
            </p>
            <p className="mt-auto pt-2 font-sans text-xs font-semibold text-ink-muted">
              {review.authorName}
              {review.itemName ? ` · ${review.itemName}` : ''} ·{' '}
              {formatDate(review.createdAt)}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
