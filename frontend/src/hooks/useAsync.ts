import { useCallback, useEffect, useRef, useState } from 'react'

export type AsyncState<T> = {
  data: T | null
  error: string | null
  loading: boolean
  /** Re-runs the loader, e.g. after a mutation. */
  reload: () => void
  /** Applies a local change without a round-trip. */
  setData: (updater: (current: T) => T) => void
}

/**
 * Runs `loader` on mount and again whenever its identity changes — so callers
 * must memoise it with `useCallback`, which is what makes the refetch explicit.
 *
 * Results from a superseded run are discarded: an in-flight request that
 * resolves after a newer one started would otherwise overwrite fresh data with
 * stale data. The same guard stops a resolve landing after unmount.
 */
export function useAsync<T>(loader: () => Promise<T>): AsyncState<T> {
  const [data, setDataState] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [nonce, setNonce] = useState(0)
  const runIdRef = useRef(0)

  // Reset to "loading" during render rather than in the effect, so the first
  // paint after a loader change never shows the previous request's result.
  const [lastRun, setLastRun] = useState({ loader, nonce })
  if (lastRun.loader !== loader || lastRun.nonce !== nonce) {
    setLastRun({ loader, nonce })
    setLoading(true)
    setError(null)
  }

  useEffect(() => {
    const runId = runIdRef.current + 1
    runIdRef.current = runId

    loader()
      .then((result) => {
        if (runIdRef.current !== runId) return
        setDataState(result)
        setError(null)
        setLoading(false)
      })
      .catch((reason: unknown) => {
        if (runIdRef.current !== runId) return
        setError(reason instanceof Error ? reason.message : 'Something went wrong')
        setLoading(false)
      })

    return () => {
      // Bumping the id marks any in-flight run as superseded.
      runIdRef.current += 1
    }
  }, [loader, nonce])

  const reload = useCallback(() => setNonce((value) => value + 1), [])

  const setData = useCallback((updater: (current: T) => T) => {
    setDataState((current) => (current === null ? current : updater(current)))
  }, [])

  return { data, error, loading, reload, setData }
}
