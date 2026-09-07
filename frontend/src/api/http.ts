const BASE_URL = '/api'

const TOKEN_KEY = 'bitebox_token'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)

export const setToken = (token: string | null): void => {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Nest returns `{ message, error, statusCode }`, where `message` is a string
 * for thrown exceptions and an array of strings for validation failures.
 * Both shapes get flattened here so callers can show `error.message` directly.
 */
const readErrorMessage = async (response: Response): Promise<string> => {
  const fallback = `Request failed with status ${response.status}`
  try {
    const body: unknown = await response.json()
    if (typeof body !== 'object' || body === null) return fallback
    const { message } = body as { message?: unknown }
    if (typeof message === 'string') return message
    if (Array.isArray(message)) return message.join(', ')
    return fallback
  } catch {
    return fallback
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
  token?: string,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : null),
        ...init?.headers,
      },
    })
  } catch {
    // fetch only rejects when the request never reached the server.
    throw new ApiError(0, 'Cannot reach the BiteBox server. Is the API running?')
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response))
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const get = <T>(path: string, token?: string, init?: RequestInit) =>
  request<T>(path, init, token)

export const post = <T>(path: string, body: unknown, token?: string) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) }, token)

export const patch = <T>(path: string, body: unknown, token?: string) =>
  request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, token)

export const put = <T>(path: string, body: unknown, token?: string) =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(body) }, token)

export const del = <T>(path: string, token?: string) =>
  request<T>(path, { method: 'DELETE' }, token)
