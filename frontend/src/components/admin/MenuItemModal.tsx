import { useRef, useState } from 'react'
import { ImagePlus, Plus, Trash2, Upload, X } from 'lucide-react'
import type { MenuItem, MenuItemInput, MenuOption } from '../../api/menu'
import { uploadImage } from '../../api/menu'
import { useAuth } from '../../context/AuthContext'
import { Field, Modal, btnGhost, inputClass, labelClass } from './ui'
import { formatPrice } from '../../utils'

type MenuItemModalProps = {
  initial: MenuItem | null
  /** Existing category names; a new one can still be typed in. */
  categories: string[]
  onSave: (input: MenuItemInput) => void
  onClose: () => void
}

type Draft = MenuItemInput & { sizes: MenuOption[]; extras: MenuOption[] }

const optionId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : `opt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

const emptyDraft = (category: string): Draft => ({
  name: '',
  description: '',
  price: 0,
  image: '',
  category,
  bestSeller: false,
  spicy: false,
  vegetarian: false,
  available: true,
  sizes: [],
  extras: [],
})

export default function MenuItemModal({
  initial,
  categories,
  onSave,
  onClose,
}: MenuItemModalProps) {
  const [draft, setDraft] = useState<Draft>(() =>
    initial
      ? {
          name: initial.name,
          description: initial.description,
          price: initial.price,
          image: initial.image,
          category: initial.category,
          bestSeller: initial.bestSeller,
          spicy: initial.spicy,
          vegetarian: initial.vegetarian,
          available: initial.available,
          sizes: initial.sizes,
          extras: initial.extras,
        }
      : emptyDraft(categories[0] ?? 'Burgers'),
  )
  const [newCategory, setNewCategory] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { token } = useAuth()

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  const handleFile = async (file: File | undefined | null) => {
    if (!file || uploading) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file (JPG, PNG, WebP, GIF…).')
      return
    }
    if (!token) {
      setUploadError('You must be signed in as an admin to upload.')
      return
    }
    setUploading(true)
    setUploadError(null)
    try {
      const url = await uploadImage(file, token)
      set('image', url)
    } catch (reason) {
      setUploadError(
        reason instanceof Error ? reason.message : 'Could not upload the image.',
      )
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const updateOption = (
    field: 'sizes' | 'extras',
    id: string,
    patch: Partial<MenuOption>,
  ) =>
    set(
      field,
      draft[field].map((option) =>
        option.id === id ? { ...option, ...patch } : option,
      ),
    )

  const removeOption = (field: 'sizes' | 'extras', id: string) =>
    set(
      field,
      draft[field].filter((option) => option.id !== id),
    )

  const addOption = (field: 'sizes' | 'extras') =>
    set(field, [
      ...draft[field],
      {
        id: optionId(),
        label: '',
        price: field === 'sizes' ? draft.price : 0,
      },
    ])

  const valid =
    draft.name.trim() !== '' &&
    draft.description.trim() !== '' &&
    draft.image.trim() !== '' &&
    draft.category.trim() !== '' &&
    draft.price >= 0

  const handleSave = () => {
    if (!valid) return
    // Half-filled option rows are dropped rather than saved with a blank label.
    const clean = (options: MenuOption[]) =>
      options
        .filter((option) => option.label.trim() !== '')
        .map((option) => ({ ...option, label: option.label.trim() }))

    onSave({
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      image: draft.image.trim(),
      category: draft.category.trim(),
      sizes: clean(draft.sizes),
      extras: clean(draft.extras),
    })
  }

  const optionEditor = (field: 'sizes' | 'extras', title: string, hint: string) => (
    <div className="rounded-control border border-white/10 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className={labelClass}>{title}</span>
        <button
          type="button"
          onClick={() => addOption(field)}
          className="inline-flex items-center gap-1 font-sans text-xs font-bold text-accent-red transition-colors duration-fast ease-ui hover:text-orange-300"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {draft[field].map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <input
              value={option.label}
              onChange={(event) =>
                updateOption(field, option.id, { label: event.target.value })
              }
              placeholder={field === 'sizes' ? 'e.g. Classic' : 'e.g. Extra Cheese'}
              className={`${inputClass} flex-1`}
            />
            <input
              type="number"
              min={0}
              value={option.price}
              onChange={(event) =>
                updateOption(field, option.id, { price: Number(event.target.value) })
              }
              placeholder="Rs"
              className={`${inputClass} w-24`}
            />
            <button
              type="button"
              onClick={() => removeOption(field, option.id)}
              className="rounded-chip p-2 text-admin-ink transition-colors duration-fast ease-ui hover:bg-red-500/20 hover:text-red-300"
              aria-label={`Remove ${field === 'sizes' ? 'size' : 'extra'}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {draft[field].length === 0 && (
          <p className="font-sans text-xs text-admin-muted">{hint}</p>
        )}
      </div>
    </div>
  )

  return (
    <Modal
      title={initial ? `Edit · ${initial.name}` : 'Add Menu Item'}
      onClose={onClose}
      width="max-w-2xl"
      footer={
        <>
          <button type="button" className={btnGhost} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-chip bg-accent-red px-5 py-2 font-sans text-sm font-bold text-white transition-colors duration-fast ease-ui hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {initial ? 'Save Changes' : 'Create Item'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="sm:w-44">
            <span className={labelClass}>Image</span>
            <div className="relative aspect-square overflow-hidden rounded-control border border-white/10 bg-admin-field">
              {uploading ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 font-sans text-xs text-admin-muted">
                  <Upload className="h-5 w-5 animate-pulse" />
                  Uploading…
                </div>
              ) : draft.image ? (
                <img
                  src={draft.image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-full w-full flex-col items-center justify-center gap-1 font-sans text-xs text-admin-muted transition-colors duration-fast ease-ui hover:text-cream"
                >
                  <ImagePlus className="h-5 w-5" />
                  Add image
                </button>
              )}
              {draft.image && !uploading && (
                <button
                  type="button"
                  onClick={() => set('image', '')}
                  title="Remove image"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors duration-fast ease-ui hover:bg-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-chip border border-white/15 px-3 py-1.5 font-sans text-xs font-bold text-cream transition-colors duration-fast ease-ui hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {draft.image ? 'Replace' : 'Upload from device'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />
            {uploadError && (
              <p className="mt-1.5 font-sans text-xs text-red-300">{uploadError}</p>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <Field label="Name">
              <input
                value={draft.name}
                onChange={(event) => set('name', event.target.value)}
                placeholder="e.g. BBQ Bacon Smash"
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (Rs)">
                <input
                  type="number"
                  min={0}
                  value={draft.price}
                  onChange={(event) => set('price', Number(event.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Category">
                {newCategory ? (
                  <input
                    value={draft.category}
                    onChange={(event) => set('category', event.target.value)}
                    placeholder="New category"
                    className={inputClass}
                    autoFocus
                  />
                ) : (
                  <select
                    value={draft.category}
                    onChange={(event) => {
                      if (event.target.value === '__new') {
                        setNewCategory(true)
                        set('category', '')
                      } else {
                        set('category', event.target.value)
                      }
                    }}
                    className={inputClass}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="__new">+ New category…</option>
                  </select>
                )}
              </Field>
            </div>
            <details className="rounded-chip border border-white/10 bg-admin-field px-3 py-1.5">
              <summary className="cursor-pointer font-sans text-xs font-semibold text-admin-muted select-none">
                Or paste an image URL
              </summary>
              <div className="pt-2">
                <Field label="Image URL">
                  <input
                    value={draft.image}
                    onChange={(event) => set('image', event.target.value)}
                    placeholder="https://…"
                    className={inputClass}
                  />
                </Field>
              </div>
            </details>
          </div>
        </div>

        <Field label="Description">
          <textarea
            value={draft.description}
            onChange={(event) => set('description', event.target.value)}
            rows={2}
            placeholder="Short appetising description…"
            className={inputClass}
          />
        </Field>

        <div className="flex flex-wrap gap-3">
          {(
            [
              ['spicy', 'Spicy'],
              ['vegetarian', 'Vegetarian'],
              ['bestSeller', 'Best seller ⭐'],
              ['available', 'Visible on menu'],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 rounded-chip border border-white/10 bg-admin-field px-3 py-2 font-sans text-sm font-semibold text-cream"
            >
              <input
                type="checkbox"
                checked={Boolean(draft[key])}
                onChange={(event) => set(key, event.target.checked)}
                className="h-4 w-4 accent-accent-red"
              />
              {label}
            </label>
          ))}
        </div>

        {optionEditor(
          'extras',
          'Extras',
          'No extras — customers order this dish as-is.',
        )}
        {optionEditor(
          'sizes',
          'Sizes',
          `No size options — sells at one price (${formatPrice(draft.price)}).`,
        )}
      </div>
    </Modal>
  )
}
