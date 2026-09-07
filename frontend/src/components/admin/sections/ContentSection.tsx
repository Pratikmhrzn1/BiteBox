import { useState } from 'react'
import { Check, Plus, Save, Trash2 } from 'lucide-react'
import { ANNOUNCEMENT_COLORS, fetchContent, updateContent } from '../../../api/content'
import type { OpeningHourRow, SiteContent } from '../../../api/content'
import { useAsync } from '../../../hooks/useAsync'
import { useAuth } from '../../../context/AuthContext'
import { useStore } from '../../../context/StoreContext'
import { Field, PanelCard, btnPrimary, inputClass } from '../ui'
import { AdminError, AdminLoading } from '../AdminStates'
import { useAdminToast } from '../AdminToast'

const emptyRow = (): OpeningHourRow => ({
  label: '',
  from: '11:30 AM',
  to: '10:00 PM',
  closed: false,
})

const loadSavedContent = () => fetchContent()

export default function ContentSection() {
  const { token } = useAuth()
  const { reloadContent } = useStore()
  const { notify } = useAdminToast()
  const { data, loading, error, reload } = useAsync(loadSavedContent)

  const [draft, setDraft] = useState<SiteContent | null>(null)
  const [seededFrom, setSeededFrom] = useState<typeof data>(null)
  const [saving, setSaving] = useState(false)

  // Seed the editable draft during render the first time the saved copy
  // arrives, and again after a save reloads it — never mid-edit.
  if (data && data !== seededFrom) {
    setSeededFrom(data)
    setDraft({
      hero: data.hero,
      announcement: data.announcement,
      openingHours: data.openingHours,
      restaurant: data.restaurant,
    })
  }

  if (loading || !draft) return <AdminLoading label="Loading site content…" />
  if (error) return <AdminError message={error} onRetry={reload} />

  const setHero = (key: keyof SiteContent['hero'], value: string) =>
    setDraft((current) =>
      current ? { ...current, hero: { ...current.hero, [key]: value } } : current,
    )

  const setRestaurant = (key: keyof SiteContent['restaurant'], value: string) =>
    setDraft((current) =>
      current
        ? { ...current, restaurant: { ...current.restaurant, [key]: value } }
        : current,
    )

  const setHour = (index: number, patch: Partial<OpeningHourRow>) =>
    setDraft((current) =>
      current
        ? {
            ...current,
            openingHours: {
              ...current.openingHours,
              rows: current.openingHours.rows.map((row, rowIndex) =>
                rowIndex === index ? { ...row, ...patch } : row,
              ),
            },
          }
        : current,
    )

  const saveAll = async () => {
    if (!token) return
    setSaving(true)
    try {
      // Blank day-range rows are dropped rather than published as empty lines.
      await updateContent(
        {
          ...draft,
          openingHours: {
            ...draft.openingHours,
            rows: draft.openingHours.rows.filter((row) => row.label.trim() !== ''),
          },
        },
        token,
      )
      notify('Content saved and published to the site')
      reload()
      reloadContent()
    } catch (reason) {
      notify(
        reason instanceof Error ? reason.message : 'Could not save the content',
        'error',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans text-sm text-admin-muted">
          Edits preview here and go live on the site with{' '}
          <span className="text-amber">Save All</span>.
        </p>
        <button
          type="button"
          className={`${btnPrimary} disabled:cursor-not-allowed disabled:opacity-60`}
          disabled={saving}
          onClick={() => void saveAll()}
        >
          <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save All'}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PanelCard title="Hero Banner">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Line 1">
              <input
                value={draft.hero.line1}
                onChange={(event) => setHero('line1', event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Line 2 (script)">
              <input
                value={draft.hero.line2}
                onChange={(event) => setHero('line2', event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Line 3">
              <input
                value={draft.hero.line3}
                onChange={(event) => setHero('line3', event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="mt-3 space-y-3">
            <Field label="Tagline / Subtext">
              <input
                value={draft.hero.subtext}
                onChange={(event) => setHero('subtext', event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="CTA Button">
              <input
                value={draft.hero.cta}
                onChange={(event) => setHero('cta', event.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="flex h-16 items-end justify-center overflow-hidden rounded-lg bg-espresso-dark px-4 pb-3 pt-4">
              <div className="text-center leading-none">
                <p className="font-titan text-xl font-bold text-white">
                  {draft.hero.line1}
                  <br />
                  <span className="font-script text-2xl text-yellow-300">
                    {draft.hero.line2}
                  </span>
                  <br />
                  {draft.hero.line3}
                </p>
              </div>
            </div>
          </div>
        </PanelCard>

        <div className="space-y-4">
          <PanelCard title="Restaurant Info">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Field label="Address">
                  <input
                    value={draft.restaurant.address}
                    onChange={(event) => setRestaurant('address', event.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Phone">
                <input
                  value={draft.restaurant.phone}
                  onChange={(event) => setRestaurant('phone', event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Email">
                <input
                  value={draft.restaurant.email}
                  onChange={(event) => setRestaurant('email', event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Hours label">
                <input
                  value={draft.restaurant.hoursLabel}
                  onChange={(event) => setRestaurant('hoursLabel', event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Hours summary">
                <input
                  value={draft.restaurant.hours}
                  onChange={(event) => setRestaurant('hours', event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </PanelCard>

          <PanelCard title="Announcement Banner">
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-2 font-sans text-sm font-semibold text-cream">
                <input
                  type="checkbox"
                  checked={draft.announcement.enabled}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? {
                            ...current,
                            announcement: {
                              ...current.announcement,
                              enabled: event.target.checked,
                            },
                          }
                        : current,
                    )
                  }
                  className="h-4 w-4 accent-accent-red"
                />
                Show announcement on the homepage
              </label>
              <Field label="Message">
                <input
                  value={draft.announcement.text}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? {
                            ...current,
                            announcement: {
                              ...current.announcement,
                              text: event.target.value,
                            },
                          }
                        : current,
                    )
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Bar color">
                <div className="flex gap-2">
                  {ANNOUNCEMENT_COLORS.map(({ label, value }) => {
                    const isActive = draft.announcement.color === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setDraft((current) =>
                            current
                              ? {
                                  ...current,
                                  announcement: {
                                    ...current.announcement,
                                    color: value,
                                  },
                                }
                              : current,
                          )
                        }
                        title={label}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                          isActive ? 'border-amber' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: value }}
                        aria-label={`Use ${label}`}
                      >
                        {isActive && <Check className="h-4 w-4 text-white" />}
                      </button>
                    )
                  })}
                </div>
              </Field>
            </div>
          </PanelCard>
        </div>
      </div>

      <PanelCard
        title="Opening Hours"
        action={
          <button
            type="button"
            onClick={() =>
              setDraft((current) =>
                current
                  ? {
                      ...current,
                      openingHours: {
                        ...current.openingHours,
                        rows: [...current.openingHours.rows, emptyRow()],
                      },
                    }
                  : current,
              )
            }
            className="inline-flex items-center gap-1 font-sans text-xs font-bold text-accent-red transition hover:text-orange-300"
          >
            <Plus className="h-3.5 w-3.5" /> Add day range
          </button>
        }
      >
        <div className="space-y-2">
          {draft.openingHours.rows.map((row, index) => (
            <div
              key={`${row.label}-${index}`}
              className="flex flex-wrap items-end gap-2 rounded-lg bg-[#403225] p-3"
            >
              <div className="min-w-32 flex-1">
                <label className="mb-1 block font-sans text-[10px] font-bold tracking-widest text-admin-muted uppercase">
                  Day range
                </label>
                <input
                  value={row.label}
                  onChange={(event) => setHour(index, { label: event.target.value })}
                  placeholder="e.g. Mon–Thu"
                  className={inputClass}
                />
              </div>
              <div className="w-28">
                <label className="mb-1 block font-sans text-[10px] font-bold tracking-widest text-admin-muted uppercase">
                  From
                </label>
                <input
                  value={row.from}
                  onChange={(event) => setHour(index, { from: event.target.value })}
                  disabled={row.closed}
                  className={inputClass}
                />
              </div>
              <div className="w-28">
                <label className="mb-1 block font-sans text-[10px] font-bold tracking-widest text-admin-muted uppercase">
                  To
                </label>
                <input
                  value={row.to}
                  onChange={(event) => setHour(index, { to: event.target.value })}
                  disabled={row.closed}
                  className={inputClass}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 font-sans text-xs font-bold text-cream">
                <input
                  type="checkbox"
                  checked={row.closed}
                  onChange={(event) => setHour(index, { closed: event.target.checked })}
                  className="h-3.5 w-3.5 accent-accent-red"
                />
                Closed
              </label>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) =>
                    current
                      ? {
                          ...current,
                          openingHours: {
                            ...current.openingHours,
                            rows: current.openingHours.rows.filter(
                              (_, rowIndex) => rowIndex !== index,
                            ),
                          },
                        }
                      : current,
                  )
                }
                className="rounded-lg p-2 text-admin-ink transition hover:bg-red-500/20 hover:text-red-300"
                aria-label="Remove day range"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <p className="font-sans text-xs text-admin-muted">
              Preview: {draft.openingHours.rows
                .filter((row) => row.label.trim())
                .map((row) =>
                  row.closed || !row.from || !row.to
                    ? `${row.label} Closed`
                    : `${row.label} ${row.from} – ${row.to}`,
                )
              .join(' · ') || 'Add a day range to preview.'}
          </p>
        </div>
      </PanelCard>
    </div>
  )
}