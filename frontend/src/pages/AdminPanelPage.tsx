import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSummary } from '../api/admin'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import { ADMIN_SECTIONS } from '../components/admin/nav'
import type { AdminSection } from '../components/admin/nav'
import Sidebar from '../components/admin/Sidebar'
import TopBar from '../components/admin/TopBar'
import { AdminToastProvider } from '../components/admin/AdminToast'
import DashboardSection from '../components/admin/sections/DashboardSection'
import OrdersSection from '../components/admin/sections/OrdersSection'
import MenuSection from '../components/admin/sections/MenuSection'
import CustomersSection from '../components/admin/sections/CustomersSection'
import MessagesSection from '../components/admin/sections/MessagesSection'
import ContentSection from '../components/admin/sections/ContentSection'
import ReviewsSection from '../components/admin/sections/ReviewsSection'
import AnalyticsSection from '../components/admin/sections/AnalyticsSection'

const SECTION_META: Record<AdminSection, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of today’s store performance' },
  orders: { title: 'Orders', subtitle: 'Track, filter and manage every order' },
  menu: { title: 'Menu', subtitle: 'Manage dishes, sizes, extras and availability' },
  customers: { title: 'Customers', subtitle: 'Registered accounts and their order counts' },
  messages: { title: 'Messages', subtitle: 'Enquiries from the contact form' },
  reviews: { title: 'Reviews', subtitle: 'Approve, hide and remove customer reviews' },
  content: { title: 'Content', subtitle: 'Edit hero, hours, info and announcements' },
  analytics: { title: 'Analytics', subtitle: 'Charts across orders, revenue and hours' },
}

export default function AdminPanelPage() {
  return (
    <AdminToastProvider>
      <AdminPanelShell />
    </AdminToastProvider>
  )
}

function AdminPanelShell() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [menuAddOpen, setMenuAddOpen] = useState(false)

  const loadSummary = useCallback(
    () => (token ? fetchSummary(token) : Promise.reject(new Error('Not signed in'))),
    [token],
  )
  const summary = useAsync(loadSummary)

  const openMenuAdd = () => {
    setSection('menu')
    setMenuAddOpen(true)
  }

  // Sections that mutate data refresh the badge counters when they finish.
  const refreshCounters = summary.reload

  return (
    <div className="flex min-h-screen bg-admin-bg text-cream">
      <Sidebar
        active={section}
        onSelect={setSection}
        onExit={() => navigate('/')}
        onSignOut={() => {
          logout()
          navigate('/login')
        }}
        adminName={user?.name ?? 'Admin'}
        adminEmail={user?.email ?? ''}
        badges={{
          messages: summary.data?.newMessages ?? 0,
          reviews: summary.data?.pendingReviews ?? 0,
          orders: summary.data?.openOrders ?? 0,
        }}
      />

      <div className="min-w-0 flex-1">
        <TopBar
          title={SECTION_META[section].title}
          subtitle={SECTION_META[section].subtitle}
          pendingCount={
            (summary.data?.newMessages ?? 0) + (summary.data?.pendingReviews ?? 0)
          }
          onOpenPending={() => setSection('messages')}
        />

        <nav className="border-b border-white/10 px-6 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {ADMIN_SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSection(id)}
                /* This row is the only way to move between sections on a
                   phone, so it takes the full 44px rather than the 36px the
                   desktop-only inline controls use. */
                className={`inline-flex min-h-11 shrink-0 items-center rounded-chip px-4 font-sans text-sm font-bold transition-[background-color,border-color,color,transform] duration-fast ease-ui active:scale-[0.96] ${
                  section === id
                    ? 'bg-accent-red text-white'
                    : 'border border-white/15 text-admin-ink hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        <main className="px-6 py-6">
          {section === 'dashboard' && (
            <DashboardSection
              summary={summary}
              onAddMenuItem={openMenuAdd}
              onOpenSection={setSection}
            />
          )}
          {section === 'orders' && <OrdersSection onChanged={refreshCounters} />}
          {section === 'menu' && (
            <MenuSection
              addOpen={menuAddOpen}
              onDismissAdd={() => setMenuAddOpen(false)}
            />
          )}
          {section === 'customers' && <CustomersSection />}
          {section === 'messages' && <MessagesSection onChanged={refreshCounters} />}
          {section === 'reviews' && <ReviewsSection onChanged={refreshCounters} />}
          {section === 'content' && <ContentSection />}
          {section === 'analytics' && <AnalyticsSection />}
        </main>
      </div>
    </div>
  )
}
