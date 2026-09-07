/** Shared input styling so every public form looks the same. */
export const fieldClass = (hasError: boolean): string =>
  `w-full rounded-xl border-2 bg-white px-4 py-3 font-sans text-sm text-ink-dark placeholder:text-ink-muted ${
    hasError ? 'border-accent-red' : 'border-ink-dark'
  }`

export const labelClass = 'mb-1.5 block font-sans text-sm font-bold text-ink-dark'
