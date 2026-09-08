import { useRef } from 'react'
import { Search, X } from 'lucide-react'

type MenuSearchBarProps = {
  query: string
  onQueryChange: (query: string) => void
}

export default function MenuSearchBar({
  query,
  onQueryChange,
}: MenuSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const hasQuery = query.length > 0

  const clear = () => {
    onQueryChange('')
    inputRef.current?.focus()
  }

  return (
    /* Leads the bar and grows to fill it. It used to be the narrowest control
     * on the page - 208px pinned to the far right corner - for what is the
     * fastest way to find a dish.
     *
     * Full width below md rather than flex-1: flex-1 carries a 0% basis, so
     * the field never forced the row to wrap and instead collapsed to just
     * its icon on a phone. A real width claims the line and pushes the two
     * secondary controls onto the next one. */
    <div className="group relative w-full min-w-0 md:w-auto md:flex-1">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted transition-colors duration-fast ease-ui group-focus-within:text-accent-red"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && hasQuery) {
            event.preventDefault()
            clear()
          }
        }}
        placeholder="Search for a burger, taco or side"
        aria-label="Search the menu"
        /* type=search keeps the searchbox semantics, but WebKit's own cancel
         * button is unstyleable and would sit beside ours. */
        className={`h-12 w-full rounded-control border-2 border-ink-dark bg-white pl-12 font-sans text-base font-medium text-ink-dark shadow-comic-sm placeholder:font-normal placeholder:text-ink-muted [&::-webkit-search-cancel-button]:appearance-none ${
          hasQuery ? 'pr-12' : 'pr-4'
        }`}
      />
      {hasQuery && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          /* tap-target gives it the full 44px without growing the 32px
           * circle, which would crowd the field. */
          className="tap-target absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-[background-color,color] duration-fast ease-ui hover:bg-ink-dark/10 hover:text-ink-dark"
        >
          <X className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
