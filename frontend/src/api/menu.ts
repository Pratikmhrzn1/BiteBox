import { del, get, patch, post } from './http'

export type MenuOption = {
  id: string
  label: string
  price: number
}

export type MenuItem = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  image: string
  category: string
  bestSeller: boolean
  spicy: boolean
  vegetarian: boolean
  available: boolean
  sizes: MenuOption[]
  extras: MenuOption[]
  rating: number
  reviewCount: number
}

export type MenuCategory = {
  id: string
  name: string
  slug: string
  image: string | null
  _count: { items: number }
}

export type MenuItemInput = {
  name: string
  description: string
  price: number
  image: string
  category: string
  bestSeller?: boolean
  spicy?: boolean
  vegetarian?: boolean
  available?: boolean
  sizes?: MenuOption[]
  extras?: MenuOption[]
}

export const fetchMenu = (includeUnavailable = false) =>
  get<MenuItem[]>(`/menu${includeUnavailable ? '?includeUnavailable=true' : ''}`)

export const fetchCategories = () => get<MenuCategory[]>('/menu/categories')

export const fetchMenuItem = (idOrSlug: string) =>
  get<MenuItem>(`/menu/${idOrSlug}`)

export const createMenuItem = (input: MenuItemInput, token: string) =>
  post<MenuItem>('/menu', input, token)

export const updateMenuItem = (
  id: string,
  input: Partial<MenuItemInput>,
  token: string,
) => patch<MenuItem>(`/menu/${id}`, input, token)

export const deleteMenuItem = (id: string, token: string) =>
  del<{ id: string; deleted: true }>(`/menu/${id}`, token)

/** Uploads an image file and returns its public URL. */
export const uploadImage = async (file: File, token: string): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch('/api/menu/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  })
  const body = (await response.json().catch(() => ({}))) as {
    url?: string
    message?: string
  }
  if (!response.ok || !body.url) {
    throw new Error(body.message ?? 'Image upload failed')
  }
  return body.url
}
