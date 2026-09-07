import { useCallback, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { fetchUsers } from '../../../api/admin'
import { useAsync } from '../../../hooks/useAsync'
import { useAuth } from '../../../context/AuthContext'
import { formatDate } from '../../../utils'
import { EmptyState, inputClass } from '../ui'
import { AdminError, AdminLoading } from '../AdminStates'

export default function CustomersSection() {
  const { token } = useAuth()
  const [query, setQuery] = useState('')

  const loadUsers = useCallback(
    () => (token ? fetchUsers(token) : Promise.reject(new Error('Not signed in'))),
    [token],
  )
  const { data, loading, error, reload } = useAsync(loadUsers)

  const users = useMemo(() => data ?? [], [data])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return users
    return users.filter((user) =>
      `${user.name} ${user.email} ${user.phone ?? ''}`
        .toLowerCase()
        .includes(normalized),
    )
  }, [users, query])

  if (loading) return <AdminLoading label="Loading customers…" />
  if (error) return <AdminError message={error} onRetry={reload} />

  return (
    <div className="space-y-4">
      <div className="relative sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, email or phone…"
          className={`${inputClass} pl-9`}
        />
      </div>

      <div className="overflow-hidden rounded-card border border-white/5 bg-admin-surface">
        {filtered.length === 0 ? (
          <EmptyState title="No customers found" hint="Try a different search." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left font-sans text-sm">
              <thead className="text-[11px] font-bold tracking-widest text-admin-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-t border-white/5">
                    <td className="px-4 py-3 font-semibold text-cream">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-admin-ink">{user.email}</td>
                    <td className="px-4 py-3 text-admin-ink">
                      {user.phone ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 font-sans text-xs font-bold ${
                          user.role === 'ADMIN'
                            ? 'bg-accent-red/20 text-accent-red'
                            : 'bg-white/5 text-admin-ink'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-amber">
                      {user._count.orders}
                    </td>
                    <td className="px-4 py-3 text-admin-ink">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
