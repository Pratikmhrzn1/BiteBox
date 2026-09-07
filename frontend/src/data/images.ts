const UNSPLASH_HOST = 'https://images.unsplash.com/'

export const unsplash = (id: string, width = 400, quality = 60) =>
  `${UNSPLASH_HOST}${id}?auto=format&fit=crop&w=${width}&q=${quality}`

const DEFAULT_WIDTHS = [320, 480, 640, 960, 1280]

/**
 * Rewrites an Unsplash URL's width parameter into a srcSet, so phones stop
 * downloading desktop-sized images. Every image in the product - the seeded
 * menu photos included - is an Unsplash URL, but menu images are editable in
 * the admin panel, so anything else returns undefined and the caller falls
 * back to plain src.
 */
export const unsplashSrcSet = (
  url: string,
  widths: number[] = DEFAULT_WIDTHS,
): string | undefined => {
  if (!url.startsWith(UNSPLASH_HOST)) return undefined

  try {
    return widths
      .map((width) => {
        const next = new URL(url)
        next.searchParams.set('w', String(width))
        return `${next.toString()} ${width}w`
      })
      .join(', ')
  } catch {
    return undefined
  }
}

/**
 * Narrows an Unsplash URL to a single size. For thumbnails, which were being
 * served the same 400px file used by full-width cards.
 */
export const unsplashAt = (url: string, width: number): string => {
  if (!url.startsWith(UNSPLASH_HOST)) return url

  try {
    const next = new URL(url)
    next.searchParams.set('w', String(width))
    return next.toString()
  } catch {
    return url
  }
}
