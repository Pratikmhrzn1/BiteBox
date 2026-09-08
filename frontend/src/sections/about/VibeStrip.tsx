import { useCallback, useEffect, useRef, useState } from 'react'
import SectionHeading from '../../components/common/SectionHeading'
import Reveal from '../../components/common/Reveal'
import { unsplashSrcSet } from '../../data/images'
import { vibeStrip } from '../../data/about'

/** Slack before an edge counts as "at the end", so a sub-pixel scroll
 *  position or an odd device ratio can't leave a fade stuck on. */
const EDGE_SLACK_PX = 4

/* Comic gutter logic, not a carousel: one wide establishing frame followed by
 * square panels, all on a shared baseline. Five identical rectangles read as
 * a component; unequal panels at one height read as a page. Written as whole
 * literal class strings because Tailwind scans source text, not runtime
 * values. */
const LEAD_PANEL = 'w-[20rem] sm:w-[24rem]'
const PANEL = 'w-52 sm:w-60'

export default function VibeStrip() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  const syncEdges = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setEdges({
      left: el.scrollLeft > EDGE_SLACK_PX,
      right: el.scrollLeft < max - EDGE_SLACK_PX,
    })
  }, [])

  useEffect(() => {
    /* Run once for the initial state - which is also how a strip that
     * happens to fit ends up with no fade at all - and again whenever the
     * viewport resizes it. */
    syncEdges()
    window.addEventListener('resize', syncEdges)
    return () => window.removeEventListener('resize', syncEdges)
  }, [syncEdges])

  return (
    <section className="mt-16 sm:mt-20">
      <Reveal>
        <SectionHeading>The BiteBox Vibe</SectionHeading>
      </Reveal>

      <div
        ref={scrollerRef}
        onScroll={syncEdges}
        data-fade-l={edges.left}
        data-fade-r={edges.right}
        className="edge-fade scrollbar-slim mt-6 snap-x snap-mandatory overflow-x-auto pb-3"
      >
        <Reveal stagger delay={100} className="flex w-max gap-4">
          {vibeStrip.map((item, i) => (
            <figure
              key={item.id}
              className={`group h-56 shrink-0 snap-start overflow-hidden rounded-card border-2 border-ink-dark shadow-comic-sm transition-[transform,box-shadow] duration-base ease-ui hover:-translate-y-1 hover:shadow-comic-md sm:h-60 ${
                i === 0 ? LEAD_PANEL : PANEL
              }`}
            >
              <img
                src={item.src}
                srcSet={unsplashSrcSet(item.src)}
                sizes={i === 0 ? '24rem' : '15rem'}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-slower ease-ui group-hover:scale-105"
              />
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
