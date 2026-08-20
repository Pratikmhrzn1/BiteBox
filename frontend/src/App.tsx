import { useEffect } from 'react'
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import AboutPage from './pages/AboutPage'
import CheckoutPage from './pages/CheckoutPage'
import { ContactUs } from './pages/ContactUs'
import { CartProvider } from './context/CartContext'
const ROUTES: Record<string, string> = {
  Home: '/',
  Menu: '/menu',
  About: '/about',
  Contact: '/contact',
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  const handleSelectLink = (label: string) => {
    if (label === 'Contact Us') {
      document
        .getElementById('contact')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    navigate(ROUTES[label] ?? '/')
  }

  const handleNav = (route: string) => navigate(route)

  const handleLocationOpen = () => {
    navigate('/')
    window.setTimeout(() => {
      document
        .getElementById('locations')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const activeLabel: string =
    location.pathname === '/menu'
      ? 'Menu'
      : location.pathname === '/about'
        ? 'About'
        : 'Home'

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar activeLink={activeLabel} onSelectLink={handleSelectLink} />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/about" element={<AboutPage onOrderNow={() => navigate('/menu')} />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer onNav={handleNav} onLocationOpen={handleLocationOpen} />
      </div>
      <CartDrawer />
    </CartProvider>
  )
}

export default App