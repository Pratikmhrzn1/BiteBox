import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

type RevealProps = {
  children: ReactNode
  /**
   * Deals the element's direct children out in sequence instead of moving
   * the element itself. Use it on a grid, never on a single card.
   */
  stagger?: boolean
  /** ms held before the element (or its first child) starts. */
  delay?: number
  as?: 'div' | 'section' | 'article'
  className?: string
}

export default function Reveal({
  children,
  stagger = false,
  delay = 0,
  as = 'div',
  className = '',
}: RevealProps) {
  const { ref, shown } = useReveal<HTMLDivElement>()

  /* Narrowed to one tag so the ref and the props typecheck against a single
   * element; React renders whichever tag the string actually names. */
  const Tag = as as 'div'

  return (
    <Tag
      ref={ref}
      className={`${stagger ? 'reveal-stagger' : 'reveal'}${
        shown ? ' is-revealed' : ''
      } ${className}`}
      style={
        delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  )
}
