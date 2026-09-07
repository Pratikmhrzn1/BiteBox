/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import type { ReactNode } from 'react'
import { fetchMenu } from '../api/menu'
import type { MenuItem } from '../api/menu'
import { FALLBACK_CONTENT, fetchContent } from '../api/content'
import type { SiteContent } from '../api/content'
import { useAsync } from '../hooks/useAsync'

/** Cross-tab channel; the admin panel broadcasts on it after publishing. */
const CONTENT_CHANNEL = 'bitebox:content'

type StoreContextValue = {
  menu: MenuItem[]
  categories: string[]
  content: SiteContent
  /** True until both the menu and the site copy have resolved. */
  loading: boolean
  /** Set when the menu could not be loaded — the site copy falls back silently. */
  error: string | null
  reloadMenu: () => void
  reloadContent: () => void
  /** Announces a published content change to every other open tab. */
  publishContentChange: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const loadMenu = useCallback(() => fetchMenu(), [])
  const loadContent = useCallback(() => fetchContent(), [])
  const menuState = useAsync(loadMenu)
  const contentState = useAsync(loadContent)

  const menu = useMemo(() => menuState.data ?? [], [menuState.data])

  const categories = useMemo(() => {
    const seen: string[] = []
    for (const item of menu) {
      if (!seen.includes(item.category)) seen.push(item.category)
    }
    return seen
  }, [menu])

  const { reload: reloadMenuFn } = menuState
  const { reload: reloadContentFn } = contentState
  const reloadMenu = useCallback(() => reloadMenuFn(), [reloadMenuFn])
  const reloadContent = useCallback(() => reloadContentFn(), [reloadContentFn])

  // When the admin publishes content in another tab or window, refetch it here
  // so the storefront reflects the change without a manual refresh. The admin's
  // own tab reloads directly on save, since BroadcastChannel does not echo to
  // the sender.
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const channel = new BroadcastChannel(CONTENT_CHANNEL)
    channel.onmessage = (event: MessageEvent) => {
      if (event.data?.type === 'content-updated') reloadContent()
    }
    return () => channel.close()
  }, [reloadContent])

  /** Announces a published change to every other open tab. Best-effort. */
  const publishContentChange = useCallback(() => {
    try {
      if (typeof BroadcastChannel === 'undefined') return
      new BroadcastChannel(CONTENT_CHANNEL).postMessage({ type: 'content-updated' })
    } catch {
      // Broadcasting is best-effort; the tab that saved already reloaded.
    }
  }, [])

  const value = useMemo<StoreContextValue>(
    () => ({
      menu,
      categories,
      // Copy is decorative: if it fails to load, render the defaults rather
      // than blocking the page on it.
      content: contentState.data ?? FALLBACK_CONTENT,
      loading: menuState.loading || contentState.loading,
      error: menuState.error,
      reloadMenu,
      reloadContent,
      publishContentChange,
    }),
    [
      menu,
      categories,
      contentState.data,
      menuState.loading,
      contentState.loading,
      menuState.error,
      reloadMenu,
      reloadContent,
      publishContentChange,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
