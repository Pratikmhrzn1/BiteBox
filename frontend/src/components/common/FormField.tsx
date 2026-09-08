import type { ReactNode } from 'react'
import { errorTextClass, labelClass } from './formStyles'

/**
 * Label, control and error message as one unit.
 *
 * Before this, every form hand-wrote the three and none of them connected the
 * error to the input: the message rendered as a loose sibling <p> with no id,
 * no aria-describedby and no aria-invalid, so "That phone number looks off"
 * reached a screen reader as orphaned text with no field attached.
 *
 * The control arrives through a render prop rather than as children so the
 * wiring cannot be forgotten - there is no way to render the input without
 * receiving the ids that describe it.
 */
export type FieldControlProps = {
  id: string
  'aria-invalid': true | undefined
  'aria-describedby': string | undefined
}

type FormFieldProps = {
  /** Also the control's id, so the label's htmlFor cannot drift from it. */
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: (control: FieldControlProps) => ReactNode
}

export default function FormField({
  id,
  label,
  error,
  hint,
  required = false,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="text-accent-red"> *</span>}
      </label>

      {hint && (
        <p id={hintId} className="mb-1.5 font-sans text-xs text-ink-muted">
          {hint}
        </p>
      )}

      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}

      {error && (
        <p id={errorId} className={errorTextClass}>
          {error}
        </p>
      )}
    </div>
  )
}
