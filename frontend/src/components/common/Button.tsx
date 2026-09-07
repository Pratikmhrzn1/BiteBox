/* eslint-disable react-refresh/only-export-components */
import type { ButtonHTMLAttributes } from 'react'

/**
 * The one button recipe.
 *
 * Before this, the storefront carried seven different accent-red button
 * treatments plus two .btn-comic-* classes and the admin panel's own set, so
 * every new button was a fresh guess at padding, radius and weight.
 *
 * Size controls the box, variant controls the surface. Nothing else. Callers
 * that need a link rather than a button import `buttonClass` directly, which
 * is why the recipe is exported separately from the component.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'quiet'
export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-control font-display uppercase leading-none ' +
  'transition-[transform,box-shadow,background-color,color] duration-fast ease-ui ' +
  'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:active:scale-100'

/* Every size clears a 44px hit target. The old in-card "Add" button was
 * roughly 28px tall, and it is the most-tapped control in the product. */
const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-4 text-sm',
  md: 'min-h-12 px-6 text-base',
  lg: 'min-h-14 px-8 text-lg',
}

/* The lift-and-drop is the comic language: the shadow is the gap under the
 * card, so pressing removes it rather than dimming the fill. */
const PRESS =
  'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.96] active:shadow-none'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: `bg-accent-red text-white shadow-comic hover:bg-accent-red-hover ${PRESS}`,
  secondary: `border-2 border-ink-dark bg-cream text-ink-dark shadow-comic hover:bg-amber ${PRESS}`,
  quiet: `border-2 border-ink-dark bg-white text-ink-dark shadow-comic-sm hover:bg-cream ${PRESS}`,
}

export const buttonClass = ({
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}): string =>
  [BASE, SIZES[size], VARIANTS[variant], className].filter(Boolean).join(' ')

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export default function Button({
  variant,
  size,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, className })}
      {...rest}
    />
  )
}
