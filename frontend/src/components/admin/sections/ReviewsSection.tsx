import { useCallback, useMemo, useState } from 'react'
import { Check, EyeOff, Star, Trash2 } from 'lucide-react'
import {
  deleteReview,
  fetchAllReviews,
  updateReviewStatus,
} from '../../../api/reviews'
import type { Review, ReviewStatus } from '../../../api/reviews'
import { useAsync } from '../../../hooks/useAsync'
import { useAuth } from '../../../context/AuthContext'
import { formatDate } from '../../../utils'
import { EmptyState, PanelCard, btnDanger, btnGhost, btnPrimary, btnSuccess, btnToggle } from '../ui'
import { AdminError, AdminLoading } from '../AdminStates'
import { useAdminToast } from '../AdminToast'

const FILTERS: ('All' | ReviewStatus)[] = ['All', 'PENDING', 'APPROVED', 'HIDDEN']

const STATUS_STYLES: Record<ReviewStatus, string> = {
  PENDING: 'bg-amber/20 text-amber',
  APPROVED: 'bg-success/15 text-success',
  HIDDEN: 'bg-white/5 text-admin-muted',
}

type ReviewsSectionProps = {
  onChanged?: () => void
}

export default function ReviewsSection({ onChanged }: ReviewsSectionProps) {
  const { token } = useAuth()
  const { notify } = useAdminToast()
  const [filter, setFilter] = useState<'All' | ReviewStatus>('All')
  const [busyId, setBusyId] = useState<string | null>(null)

  const loadReviews = useCallback(
    () => (token ? fetchAllReviews(token) : Promise.reject(new Error('Not signed in'))),
    [token],
  )
  const { data, loading, error, reload, setData } = useAsync(loadReviews)

  const reviews = useMemo(() => data ?? [], [data])

  const counts = useMemo(() => {
    const tally: Record<string, number> = { All: reviews.length }
    for (const status of ['PENDING', 'APPROVED', 'HIDDEN'] as ReviewStatus[]) {
      tally[status] = reviews.filter((review) => review.status === status).length
    }
    return tally
  }, [reviews])

  /** Average over approved reviews only — the same set the public site shows. */
  const stats = useMemo(() => {
    const approved = reviews.filter((review) => review.status === 'APPROVED')
    const counts5 = [0, 0, 0, 0, 0]
    for (const review of approved) {
      counts5[Math.min(Math.max(review.rating, 1), 5) - 1] += 1
    }
    const total = approved.length
    const average =
      total === 0
        ? 0
        : approved.reduce((sum, review) => sum + review.rating, 0) / total
    return { average: Math.round(average * 10) / 10, total, counts: counts5 }
  }, [reviews])

  const filtered = useMemo(
    () =>
      filter === 'All'
        ? reviews
        : reviews.filter((review) => review.status === filter),
    [reviews, filter],
  )

  const setStatus = async (review: Review, status: ReviewStatus) => {
    if (!token) return
    setBusyId(review.id)
    try {
      const updated = await updateReviewStatus(review.id, status, token)
      setData((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      notify(`Review ${status.toLowerCase()}`)
      onChanged?.()
    } catch (reason) {
      notify(
        reason instanceof Error ? reason.message : 'Could not update the review',
        'error',
      )
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (review: Review) => {
    if (!token) return
    setBusyId(review.id)
    try {
      await deleteReview(review.id, token)
      setData((current) => current.filter((item) => item.id !== review.id))
      notify('Review deleted')
      onChanged?.()
    } catch (reason) {
      notify(
        reason instanceof Error ? reason.message : 'Could not delete the review',
        'error',
      )
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <AdminLoading label="Loading reviews…" />
  if (error) return <AdminError message={error} onRetry={reload} />

  const maxCount = Math.max(...stats.counts, 1)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <PanelCard title="Rating Summary">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-sans text-4xl font-bold text-amber">
                {stats.total === 0 ? '—' : stats.average.toFixed(1)}
              </p>
              <div className="mt-1 flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= Math.round(stats.average)
                        ? 'text-amber'
                        : 'text-white/15'
                    }`}
                    fill={star <= Math.round(stats.average) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <p className="mt-1 font-sans text-xs text-admin-muted">
                {stats.total} approved
              </p>
            </div>

            <ul className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <li key={star} className="flex items-center gap-2">
                  <span className="w-3 font-sans text-xs font-bold text-admin-muted">
                    {star}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-amber"
                      style={{
                        width: `${(stats.counts[star - 1] / maxCount) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-sans text-xs text-admin-ink">
                    {stats.counts[star - 1]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </PanelCard>

        <PanelCard title="Moderation Queue">
          <p className="font-sans text-sm text-admin-ink">
            {counts.PENDING === 0
              ? 'Nothing waiting — every review has been actioned.'
              : `${counts.PENDING} review${counts.PENDING === 1 ? '' : 's'} waiting for a decision. New reviews stay hidden from the site until approved.`}
          </p>
          {counts.PENDING > 0 && (
            <button
              type="button"
              onClick={() => setFilter('PENDING')}
              className={`${btnPrimary} mt-3`}
            >
              Review them
            </button>
          )}
        </PanelCard>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={btnToggle(filter === id)}
          >
            {id === 'All' ? 'All' : id.charAt(0) + id.slice(1).toLowerCase()}
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                filter === id ? 'bg-white/20' : 'bg-white/5'
              }`}
            >
              {counts[id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-white/10 bg-admin-surface">
          <EmptyState title="No reviews here" hint="Try a different filter." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((review) => (
            <article
              key={review.id}
              className={`rounded-card border border-white/10 bg-admin-surface p-5 transition-colors duration-fast ease-ui ${
                busyId === review.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= review.rating ? 'text-amber' : 'text-white/15'
                        }`}
                        fill={star <= review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase ${STATUS_STYLES[review.status]}`}
                  >
                    {review.status}
                  </span>
                </div>
                <span className="font-sans text-xs text-admin-muted">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              <h3 className="mt-2 font-sans text-base font-bold text-cream">
                {review.title}
              </h3>
              <p className="mt-1 font-sans text-sm text-admin-ink">{review.body}</p>
              <p className="mt-2 font-sans text-xs font-semibold text-admin-muted">
                {review.authorName}
                {review.itemName ? ` · ${review.itemName}` : ''}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                {review.status !== 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => void setStatus(review, 'APPROVED')}
                    className={btnSuccess}
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
                {review.status !== 'HIDDEN' && (
                  <button
                    type="button"
                    onClick={() => void setStatus(review, 'HIDDEN')}
                    className={btnGhost}
                  >
                    <EyeOff className="h-3.5 w-3.5" /> Hide
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void remove(review)}
                  className={`${btnDanger} ml-auto`}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
