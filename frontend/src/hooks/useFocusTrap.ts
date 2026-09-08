import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Keeps Tab inside an open dialog.
 *
 * Every dialog in this product already saved focus, moved it in, restored it
 * on close and closed on Escape - but none of them trapped Tab. From the
 * customize dialog, four tabs walked you out into the page behind while
 * aria-modal="true" told assistive tech that page did not exist. The cart
 * drawer's `inert` guards the closed state, not the open one.
 *
 * The listener runs in the capture phase so it wins over anything inside the
 * dialog that also handles Tab.
 */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active = true,
): void {
  useEffect(() => {
    if (!active) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const node = ref.current
      if (!node) return

      /* Queried on every Tab rather than cached on open: dialog contents
       * change - the cart empties, an address field appears - and a stale list
       * would hand focus to a detached node. getClientRects covers both
       * display:none and the fixed-position drawer, where offsetParent lies. */
      const items = Array.from(
        node.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => element.getClientRects().length > 0)

      if (items.length === 0) {
        event.preventDefault()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement

      if (event.shiftKey) {
        if (current === first || !node.contains(current)) {
          event.preventDefault()
          last.focus()
        }
        return
      }

      if (current === last || !node.contains(current)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [ref, active])
}
