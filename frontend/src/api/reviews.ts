import { del, get, patch, post } from './http'

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'HIDDEN'

export type Review = {
  id: string
  authorName: string
  rating: number
  title: string
  body: string
  status: ReviewStatus
  itemName: string | null
  createdAt: string
}

export type ReviewSummary = {
  average: number
  total: number
  /** Counts for 1★ through 5★, in that order. */
  counts: number[]
}

export type CreateReviewInput = {
  authorName?: string
  menuItem?: string
  rating: number
  title: string
  body: string
}

export const fetchReviews = (menuItem?: string) =>
  get<Review[]>(`/reviews${menuItem ? `?menuItem=${encodeURIComponent(menuItem)}` : ''}`)

export const fetchReviewSummary = () => get<ReviewSummary>('/reviews/summary')

export const createReview = (input: CreateReviewInput, token?: string) =>
  post<Review>('/reviews', input, token)

export const fetchAllReviews = (token: string) =>
  get<Review[]>('/reviews/all', token)

export const updateReviewStatus = (
  id: string,
  status: ReviewStatus,
  token: string,
) => patch<Review>(`/reviews/${id}/status`, { status }, token)

export const deleteReview = (id: string, token: string) =>
  del<{ id: string; deleted: true }>(`/reviews/${id}`, token)
