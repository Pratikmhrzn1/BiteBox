import { useEffect } from 'react'
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import CartDrawer from './shared/CartDrawer'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import AboutPage from './pages/AboutPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import TrackOrderPage from './pages/TrackOrderPage'
import AccountPage from './pages/AccountPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { ContactUs } from './pages/ContactUs'
import NotFoundPage from './pages/NotFoundPage'
import AdminPanelPage from './pages/AdminPanelPage'
import RequireAdmin from './components/admin/RequireAdmin'
import { ToastProvider } from './components/common/Toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { StoreProvider } from './context/StoreContext'

/** The admin panel supplies its own chrome, so the storefront shell is hidden. */
const isAdminRoute = (pathname: string) => pathname.startsWith('/admin')

function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const adminRoute = isAdminRoute(location.pathname)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      {/* First thing in the tab order: lets keyboard and screen-reader users
          past the nav instead of walking it on every page. Hidden until it
          takes focus. */}
      {!adminRoute && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-control focus:border-2 focus:border-ink-dark focus:bg-amber focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-bold focus:text-ink-dark"
        >
          Skip to content
        </a>
      )}

      {!adminRoute && <Navbar />}

      <div id="main-content" tabIndex={-1} className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route
            path="/about"
            element={
              <AboutPage
                onOrderNow={() => navigate('/menu')}
                /* The About page carries its own outlet maps now, so this
                 * scrolls to them instead of navigating to the home page to
                 * show the same two maps. */
                onLocationOpen={() => {
                  document
                    .getElementById('locations')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              />
            }
          />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:reference" element={<OrderConfirmationPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/track/:reference" element={<TrackOrderPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* The old admin sign-in path still works; both land on /login. */}
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminPanelPage />
              </RequireAdmin>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {!adminRoute && <Footer />}
      {!adminRoute && <CartDrawer />}
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <AppShell />
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
