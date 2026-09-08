/**
 * The one input recipe.
 *
 * This was two lines with no focus, hover, disabled or error affordance and a
 * `rounded-xl` that bypassed the radius scale for a value the `control` token
 * already held. It dresses five surfaces - login, register, checkout, contact
 * and reviews - so every gap in it was a gap in all of them.
 *
 * Focus itself is not declared here: the global *:focus-visible ring in
 * index.css already covers every focusable element, and browsers match text
 * inputs on pointer focus too, so a second treatment would only fight it.
 */
const FIELD_BASE =
  'w-full min-h-12 rounded-control border-2 bg-white px-4 py-3 font-sans text-sm text-ink-dark ' +
  'placeholder:text-ink-muted transition-[background-color,border-color] duration-fast ease-ui ' +
  'hover:bg-cream/40 ' +
  'disabled:cursor-not-allowed disabled:border-ink-muted/40 disabled:bg-canvas/30 ' +
  'disabled:text-ink-muted disabled:hover:bg-canvas/30'

/* Error is carried by border colour and a tinted ground, never by colour
 * alone: the message below the field is the cue that survives colour
 * blindness, and FormField wires it to the input with aria-describedby. */
export const fieldClass = (hasError = false): string =>
  `${FIELD_BASE} ${
    hasError
      ? 'border-accent-red bg-accent-red/5 hover:bg-accent-red/5'
      : 'border-ink-dark'
  }`

export const labelClass = 'mb-1.5 block font-sans text-sm font-bold text-ink-dark'

export const errorTextClass =
  'mt-1.5 font-sans text-xs font-semibold text-accent-red'

/**
 * Moves focus to the first field that failed validation.
 *
 * Submitting an invalid form used to paint the fields red and leave focus on
 * the submit button, so a screen-reader user got no notice at all. Landing on
 * the offending field reads its label and, through aria-describedby, the
 * reason - which is why this takes the fields in DOM order rather than
 * iterating the errors object, whose key order is not the visual one.
 */
export const focusFirstError = <Key extends string>(
  fieldsInOrder: readonly (readonly [Key, string])[],
  errors: Partial<Record<Key, string | undefined>>,
): void => {
  for (const [key, elementId] of fieldsInOrder) {
    if (errors[key]) {
      document.getElementById(elementId)?.focus()
      return
    }
  }
}
