import { useEffect, useRef, useState } from 'react'

/**
 * Marks an element as revealed the first time it scrolls into reading
 * position.
 *
 * One IntersectionObserver serves the whole page rather than one per element.
 * The About page reveals ~20 nodes; twenty observers is twenty callback sets
 * the compositor has to service, for a signal that is identical in all of
 * them.
 */
let observer: IntersectionObserver | null = null
const onIntersect = new WeakMap<Element, () => void>()

function sharedObserver(): IntersectionObserver {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        onIntersect.get(entry.target)?.()
        release(entry.target)
      }
    },
    /* No threshold, and a bottom margin instead: a band taller than the
     * viewport can never satisfy a percentage threshold, so keying off the
     * first pixel to cross a line 12% up from the fold treats a short card
     * and a full-height section the same way. */
    { rootMargin: '0px 0px -12% 0px' },
  )
  return observer
}

function release(el: Element) {
  observer?.unobserve(el)
  onIntersect.delete(el)
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return

    /* Checked here rather than at module scope so a mid-session change to
     * the OS setting is picked up on the next mount. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    onIntersect.set(el, () => setShown(true))
    sharedObserver().observe(el)
    return () => release(el)
  }, [shown])

  return { ref, shown }
}
