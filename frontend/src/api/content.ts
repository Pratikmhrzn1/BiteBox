import { get, put } from './http'

export type HeroContent = {
  line1: string
  line2: string
  line3: string
  subtext: string
  cta: string
}

export type AnnouncementContent = {
  enabled: boolean
  text: string
  color: string
}

export type OpeningHourRow = {
  label: string
  from: string
  to: string
  closed: boolean
}

export type OpeningHoursContent = {
  title: string
  rows: OpeningHourRow[]
}

export type RestaurantContent = {
  address: string
  mapEmbedUrl: string
  phone: string
  email: string
  hoursLabel: string
  hours: string
}

export type SiteContent = {
  hero: HeroContent
  announcement: AnnouncementContent
  openingHours: OpeningHoursContent
  restaurant: RestaurantContent
}

export const ANNOUNCEMENT_COLORS = [
  { label: 'Red', value: '#CE3D27' },
  { label: 'Burnt Orange', value: '#D25F26' },
  { label: 'Olive', value: '#8C9A09' },
  { label: 'Espresso', value: '#303411' },
] as const

/**
 * Rendered before the API responds and if the request fails, so the site never
 * shows an empty hero. Kept in step with `DEFAULT_SITE_CONTENT` on the server.
 */
export const FALLBACK_CONTENT: SiteContent = {
  hero: {
    line1: 'EAT',
    line2: 'ENJOY',
    line3: 'REPEAT',
    subtext:
      'Smashed fresh. Served loud. Nakhipot’s favourite smash burgers since day one.',
    cta: 'Order Now',
  },
  announcement: { enabled: false, text: '', color: '#CE3D27' },
  openingHours: {
    title: 'Opening Hours',
    rows: [
      { label: 'Mon–Thu', from: '11:30 AM', to: '10:00 PM', closed: false },
      { label: 'Fri–Sun', from: '11:30 AM', to: '11:00 PM', closed: false },
    ],
  },
  restaurant: {
    address: 'Nakhipot, Lalitpur, Nepal',
    mapEmbedUrl:
      'https://maps.google.com/maps?q=Nakhipot%20Lalitpur&ll=27.6551,85.3157&z=16&output=embed',
    phone: '+977 9800000000',
    email: 'hello@bitebox.com.np',
    hoursLabel: "We're Open",
    hours: 'Mon–Sun: 11:30 AM – 10:00 PM',
  },
}

/**
 * Fetches fresh site copy on every call. The server tags the response with an
 * ETag but no Cache-Control, so a browser can re-serve yesterday's copy from
 * cache after an admin edit; `cache: 'no-store'` guarantees the storefront
 * always reflects the last change published from the admin panel.
 */
export const fetchContent = () =>
  get<SiteContent & { updatedAt: string }>('/content', undefined, {
    cache: 'no-store',
  })

export const updateContent = (content: SiteContent, token: string) =>
  put<SiteContent & { updatedAt: string }>('/content', content, token)
