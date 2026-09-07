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

/** Sunday-first, matching Date#getDay. */
const DAY_INDEX: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
}

/** "11:30 AM", "10:00 PM" and "23:00" all become minutes from midnight. */
const parseClock = (value: string): number | null => {
  const match = /^\s*(\d{1,2})(?::(\d{2}))?\s*([ap]\.?m\.?)?\s*$/i.exec(value)
  if (!match) return null

  let hours = Number(match[1])
  const minutes = Number(match[2] ?? 0)
  const meridiem = match[3]?.toLowerCase().replace(/\./g, '')

  if (hours > 23 || minutes > 59) return null
  if (meridiem === 'pm' && hours < 12) hours += 12
  if (meridiem === 'am' && hours === 12) hours = 0

  return hours * 60 + minutes
}

/**
 * Expands a row label into the days it covers. Handles a single day ("Sat"),
 * a range in either dash ("Mon–Thu", "Fri-Sun"), and a list ("Mon, Wed").
 * Ranges wrap, so "Fri–Sun" is Friday, Saturday, Sunday.
 */
const parseDays = (label: string): number[] => {
  const days = new Set<number>()

  for (const part of label.split(/[,/&]|\band\b/i)) {
    const tokens = part
      .split(/[–—-]/)
      .map((token) => DAY_INDEX[token.trim().slice(0, 3).toLowerCase()])
      .filter((day): day is number => day !== undefined)

    if (tokens.length === 1) {
      days.add(tokens[0])
    } else if (tokens.length >= 2) {
      const [start, end] = [tokens[0], tokens[tokens.length - 1]]
      for (let step = 0; step <= 6; step += 1) {
        const day = (start + step) % 7
        days.add(day)
        if (day === end) break
      }
    }
  }

  return [...days]
}

/**
 * Whether the shop is open, according to the opening hours the admin actually
 * published. This previously hardcoded 11:30-22:00 and ignored the content
 * entirely, so the storefront advertised "Open Now" on days it was closed.
 */
export const isOpenNow = (
  rows: { label: string; from: string; to: string; closed: boolean }[],
  now: Date = new Date(),
): boolean => {
  const today = now.getDay()
  const minutes = now.getHours() * 60 + now.getMinutes()

  const row = rows.find((candidate) => parseDays(candidate.label).includes(today))
  if (!row || row.closed || !row.from || !row.to) return false

  const from = parseClock(row.from)
  const to = parseClock(row.to)
  if (from === null || to === null) return false

  // A closing time earlier than the opening time runs past midnight.
  return to > from ? minutes >= from && minutes < to : minutes >= from || minutes < to
}
