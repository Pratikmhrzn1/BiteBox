export const formatPrice = (amount: number): string =>
  `Rs ${amount.toLocaleString('en-IN')}`

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })

export const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
  })

/**
 * Picks a legible foreground for a colour chosen at runtime in the admin
 * panel. The announcement banner used to hardcode white text, so any light
 * colour an admin picked rendered the message invisible.
 *
 * Returns whichever of ink or white scores the higher contrast ratio.
 */
export const readableInkOn = (background: string): string => {
  const raw = background.trim().replace('#', '')
  const hex =
    raw.length === 3
      ? raw
          .split('')
          .map((char) => char + char)
          .join('')
      : raw

  if (!/^[0-9a-f]{6}$/i.test(hex)) return '#FFFFFF'

  const channel = (offset: number): number => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }

  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4)
  const againstInk = (luminance + 0.05) / 0.05
  const againstWhite = 1.05 / (luminance + 0.05)

  return againstInk > againstWhite ? '#241A12' : '#FFFFFF'
}
