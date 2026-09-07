import { Search } from 'lucide-react'

type MenuSearchBarProps = {
  query: string
  onQueryChange: (query: string) => void
}

export default function MenuSearchBar({
  query,
  onQueryChange,
}: MenuSearchBarProps) {
  return (
    <div className="relative w-full shrink-0 md:ml-auto md:w-48 lg:w-52">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search menu..."
        className="w-full rounded-chip border-2 border-ink-dark bg-white py-2 pl-9 pr-3 font-sans text-sm font-medium text-ink-dark shadow-comic-sm placeholder:text-ink-muted focus:bg-amber/20"
      />
    </div>
  )
}
