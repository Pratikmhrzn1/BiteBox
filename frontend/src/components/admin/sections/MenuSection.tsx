import { useMemo, useState } from 'react'
import { Eye, EyeOff, Flame, Leaf, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import {
  createMenuItem,
  deleteMenuItem,
  updateMenuItem,
} from '../../../api/menu'
import type { MenuItem, MenuItemInput } from '../../../api/menu'
import { useAuth } from '../../../context/AuthContext'
import { useStore } from '../../../context/StoreContext'
import { fetchMenu } from '../../../api/menu'
import { useAsync } from '../../../hooks/useAsync'
import { formatPrice } from '../../../utils'
import { EmptyState, Modal, btnDanger, btnGhost, btnPrimary, inputClass } from '../ui'
import { AdminError, AdminLoading } from '../AdminStates'
import MenuItemModal from '../MenuItemModal'
import { useAdminToast } from '../AdminToast'

type MenuSectionProps = {
  addOpen: boolean
  onDismissAdd: () => void
}

/** Includes hidden dishes, which the storefront menu omits. */
const loadFullMenu = () => fetchMenu(true)

export default function MenuSection({ addOpen, onDismissAdd }: MenuSectionProps) {
  const { token } = useAuth()
  const { reloadMenu } = useStore()
  const { notify } = useAdminToast()

  // The admin view includes hidden dishes, which the storefront menu omits.
  const { data, loading, error, reload } = useAsync(loadFullMenu)

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<MenuItem | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const menu = useMemo(() => data ?? [], [data])
  const showModal = addOpen || adding || editing !== null

  const categories = useMemo(
    () => ['All', ...new Set(menu.map((item) => item.category))],
    [menu],
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return menu.filter((item) => {
      if (category !== 'All' && item.category !== category) return false
      return !normalized || item.name.toLowerCase().includes(normalized)
    })
  }, [menu, query, category])

  /** Refreshes both this list and the storefront copy of the menu. */
  const refreshAll = () => {
    reload()
    reloadMenu()
  }

  const closeModal = () => {
    setAdding(false)
    setEditing(null)
    onDismissAdd()
  }

  const handleSave = async (input: MenuItemInput, id: string | null) => {
    if (!token) return
    try {
      if (id) {
        await updateMenuItem(id, input, token)
        notify('Menu item updated')
      } else {
        await createMenuItem(input, token)
        notify('Menu item added')
      }
      closeModal()
      refreshAll()
    } catch (reason) {
      notify(
        reason instanceof Error ? reason.message : 'Could not save the item',
        'error',
      )
    }
  }

  const patch = async (item: MenuItem, changes: Partial<MenuItemInput>, message: string) => {
    if (!token) return
    setBusyId(item.id)
    try {
      await updateMenuItem(item.id, changes, token)
      notify(message)
      refreshAll()
    } catch (reason) {
      notify(
        reason instanceof Error ? reason.message : 'Could not update the item',
        'error',
      )
    } finally {
      setBusyId(null)
    }
  }

  const confirmDelete = async () => {
    if (!deleting || !token) return
    setBusyId(deleting.id)
    try {
      await deleteMenuItem(deleting.id, token)
      notify('Menu item deleted')
      setDeleting(null)
      refreshAll()
    } catch (reason) {
      notify(
        reason instanceof Error ? reason.message : 'Could not delete the item',
        'error',
      )
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <AdminLoading label="Loading menu…" />
  if (error) return <AdminError message={error} onRetry={reload} />

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-chip px-3 py-1.5 font-sans text-sm font-bold transition-colors duration-fast ease-ui ${
                category === cat
                  ? 'bg-accent-red text-white'
                  : 'border border-white/15 text-admin-ink hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button type="button" className={btnPrimary} onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" /> Add Menu Item
        </button>
      </div>

      <div className="relative sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search menu items…"
          className={`${inputClass} pl-9`}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No items found" hint="Adjust search or category." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`group overflow-hidden rounded-card border border-white/5 bg-admin-surface transition-colors duration-fast ease-ui ${
                busyId === item.id ? 'opacity-50' : ''
              } ${item.available ? '' : 'opacity-70'}`}
            >
              <div className="relative h-40">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-admin-surface to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-admin-field/90 px-2 py-0.5 font-sans text-[10px] font-bold tracking-widest text-amber uppercase">
                  {item.category}
                </span>
                {!item.available && (
                  <span className="absolute left-3 bottom-3 rounded-full bg-red-900/90 px-2 py-0.5 font-sans text-[10px] font-bold tracking-widest text-red-200 uppercase">
                    Hidden
                  </span>
                )}
                <button
                  type="button"
                  onClick={() =>
                    void patch(
                      item,
                      { bestSeller: !item.bestSeller },
                      'Best-seller updated',
                    )
                  }
                  title="Toggle best seller"
                  className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-fast ease-ui ${
                    item.bestSeller
                      ? 'bg-amber text-ink-dark'
                      : 'bg-admin-field/80 text-admin-muted hover:text-amber'
                  }`}
                >
                  <Star
                    className="h-4 w-4"
                    fill={item.bestSeller ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-sans text-base font-bold text-cream">
                    {item.name}
                  </h3>
                  <span className="shrink-0 font-sans text-base font-bold text-amber">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <p className="line-clamp-2 font-sans text-xs text-admin-muted">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.spicy && (
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 font-sans text-[10px] font-bold text-red-300">
                      <Flame className="h-3 w-3" aria-hidden="true" /> Spicy
                    </span>
                  )}
                  {item.vegetarian && (
                    <span className="rounded-full bg-lime-500/15 px-2 py-0.5 font-sans text-[10px] font-bold text-lime-300">
                      <Leaf className="h-3 w-3" aria-hidden="true" /> Veg
                    </span>
                  )}
                  {item.reviewCount > 0 && (
                    <span className="rounded-full bg-amber/15 px-2 py-0.5 font-sans text-[10px] font-bold text-amber">
                      ★ {item.rating.toFixed(1)} ({item.reviewCount})
                    </span>
                  )}
                  {item.sizes.length > 0 && (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 font-sans text-[10px] font-bold text-admin-ink">
                      {item.sizes.length} sizes
                    </span>
                  )}
                  {item.extras.length > 0 && (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 font-sans text-[10px] font-bold text-admin-ink">
                      {item.extras.length} extras
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 border-t border-white/5 pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      void patch(
                        item,
                        { available: !item.available },
                        item.available ? 'Item hidden from menu' : 'Item back on the menu',
                      )
                    }
                    title={item.available ? 'Hide from menu' : 'Show on menu'}
                    className="inline-flex items-center gap-1.5 rounded-chip bg-white/5 px-2.5 py-1.5 font-sans text-xs font-bold text-admin-ink transition-colors duration-fast ease-ui hover:bg-white/10"
                  >
                    {item.available ? (
                      <>
                        <Eye className="h-3.5 w-3.5" /> Live
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5" /> Hidden
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-chip border border-white/15 px-2.5 py-1.5 font-sans text-xs font-bold text-cream transition-colors duration-fast ease-ui hover:bg-white/5"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(item)}
                    className="inline-flex items-center gap-1.5 rounded-chip border border-red-500/30 px-2.5 py-1.5 font-sans text-xs font-bold text-red-300 transition-colors duration-fast ease-ui hover:bg-red-500/15"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <MenuItemModal
          initial={editing}
          categories={categories.filter((cat) => cat !== 'All')}
          onClose={closeModal}
          onSave={(input) => void handleSave(input, editing?.id ?? null)}
        />
      )}

      {deleting && (
        <Modal
          title="Delete Menu Item"
          onClose={() => setDeleting(null)}
          width="max-w-sm"
          footer={
            <>
              <button type="button" className={btnGhost} onClick={() => setDeleting(null)}>
                Cancel
              </button>
              <button
                type="button"
                className={btnDanger}
                onClick={() => void confirmDelete()}
              >
                Delete
              </button>
            </>
          }
        >
          <p className="font-sans text-sm text-admin-ink">
            Permanently remove{' '}
            <span className="font-bold text-cream">{deleting.name}</span> from the
            menu? Past orders keep their own record, so history is unaffected. To
            take it off the menu temporarily, hide it instead.
          </p>
        </Modal>
      )}
    </div>
  )
}
