import { useCallback, useMemo, useState } from 'react'
import { Archive, Mail, MailOpen, Trash2 } from 'lucide-react'
import {
  deleteMessage,
  fetchMessages,
  updateMessageStatus,
} from '../../../api/contact'
import type { ContactMessage, MessageStatus } from '../../../api/contact'
import { useAsync } from '../../../hooks/useAsync'
import { useAuth } from '../../../context/AuthContext'
import { formatDateTime } from '../../../utils'
import { EmptyState, btnToggle } from '../ui'
import { AdminError, AdminLoading } from '../AdminStates'
import { useAdminToast } from '../AdminToast'

const FILTERS: ('All' | MessageStatus)[] = ['All', 'NEW', 'READ', 'ARCHIVED']

const STATUS_STYLES: Record<MessageStatus, string> = {
  NEW: 'bg-accent-red/20 text-accent-red',
  READ: 'bg-white/5 text-admin-ink',
  ARCHIVED: 'bg-white/5 text-admin-muted',
}

type MessagesSectionProps = {
  onChanged?: () => void
}

export default function MessagesSection({ onChanged }: MessagesSectionProps) {
  const { token } = useAuth()
  const { notify } = useAdminToast()
  const [filter, setFilter] = useState<'All' | MessageStatus>('All')
  const [busyId, setBusyId] = useState<string | null>(null)

  const loadMessages = useCallback(
    () => (token ? fetchMessages(token) : Promise.reject(new Error('Not signed in'))),
    [token],
  )
  const { data, loading, error, reload, setData } = useAsync(loadMessages)

  const messages = useMemo(() => data ?? [], [data])
  const filtered = useMemo(
    () =>
      filter === 'All'
        ? messages
        : messages.filter((message) => message.status === filter),
    [messages, filter],
  )

  const counts = useMemo(() => {
    const tally: Record<string, number> = { All: messages.length }
    for (const status of ['NEW', 'READ', 'ARCHIVED'] as MessageStatus[]) {
      tally[status] = messages.filter((message) => message.status === status).length
    }
    return tally
  }, [messages])

  const setStatus = async (message: ContactMessage, status: MessageStatus) => {
    if (!token) return
    setBusyId(message.id)
    try {
      const updated = await updateMessageStatus(message.id, status, token)
      setData((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      notify(`Marked as ${status.toLowerCase()}`)
      onChanged?.()
    } catch (reason) {
      notify(
        reason instanceof Error ? reason.message : 'Could not update the message',
        'error',
      )
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (message: ContactMessage) => {
    if (!token) return
    setBusyId(message.id)
    try {
      await deleteMessage(message.id, token)
      setData((current) => current.filter((item) => item.id !== message.id))
      notify('Message deleted')
      onChanged?.()
    } catch (reason) {
      notify(
        reason instanceof Error ? reason.message : 'Could not delete the message',
        'error',
      )
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <AdminLoading label="Loading messages…" />
  if (error) return <AdminError message={error} onRetry={reload} />

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={btnToggle(filter === id)}
          >
            {id === 'All' ? 'All' : id.charAt(0) + id.slice(1).toLowerCase()}
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                filter === id ? 'bg-white/20' : 'bg-white/5'
              }`}
            >
              {counts[id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-white/5 bg-admin-surface">
          <EmptyState
            title="No messages here"
            hint="Enquiries from the contact form land in this inbox."
          />
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((message) => (
            <li
              key={message.id}
              className={`rounded-card border border-white/5 bg-admin-surface p-5 transition-colors duration-fast ease-ui ${
                busyId === message.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-sans text-base font-bold text-cream">
                      {message.name}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase ${STATUS_STYLES[message.status]}`}
                    >
                      {message.status}
                    </span>
                    <span className="rounded-full bg-amber/15 px-2 py-0.5 font-sans text-[10px] font-bold text-amber">
                      {message.subject}
                    </span>
                  </div>
                  <p className="mt-0.5 font-sans text-xs text-admin-muted">
                    <a
                      href={`mailto:${message.email}`}
                      className="transition-colors duration-fast ease-ui hover:text-amber"
                    >
                      {message.email}
                    </a>
                    {message.phone ? ` · ${message.phone}` : ''} ·{' '}
                    {formatDateTime(message.createdAt)}
                  </p>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap font-sans text-sm text-admin-ink">
                {message.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                <a
                  href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                  className="inline-flex items-center gap-1.5 rounded-chip bg-accent-red px-3 py-1.5 font-sans text-xs font-bold text-white transition-colors duration-fast ease-ui hover:bg-red-700"
                >
                  <Mail className="h-3.5 w-3.5" /> Reply
                </a>
                {message.status !== 'READ' && (
                  <button
                    type="button"
                    onClick={() => void setStatus(message, 'READ')}
                    className="inline-flex items-center gap-1.5 rounded-chip border border-white/15 px-3 py-1.5 font-sans text-xs font-bold text-cream transition-colors duration-fast ease-ui hover:bg-white/5"
                  >
                    <MailOpen className="h-3.5 w-3.5" /> Mark read
                  </button>
                )}
                {message.status !== 'ARCHIVED' && (
                  <button
                    type="button"
                    onClick={() => void setStatus(message, 'ARCHIVED')}
                    className="inline-flex items-center gap-1.5 rounded-chip border border-white/15 px-3 py-1.5 font-sans text-xs font-bold text-cream transition-colors duration-fast ease-ui hover:bg-white/5"
                  >
                    <Archive className="h-3.5 w-3.5" /> Archive
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void remove(message)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-chip border border-red-500/30 px-3 py-1.5 font-sans text-xs font-bold text-red-300 transition-colors duration-fast ease-ui hover:bg-red-500/15"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
