import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, MapPin, Package, ShoppingBag, User } from 'lucide-react'
import { logoImg } from '../assets'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
] as const

const bar =
  'h-0.5 w-6 rounded bg-accent-red transition-[transform,opacity] duration-base ease-ui'

/* Desktop: an inline item, so the active marker is an underline the width of
 * the word. */
const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'relative font-sans text-sm font-bold tracking-wide text-accent-red uppercase after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded after:bg-accent-red'
    : 'font-sans text-sm font-semibold tracking-wide text-espresso-dark uppercase transition-colors duration-fast ease-ui hover:text-accent-red'

/* Mobile: the same items stack, and the desktop recipe broke twice over.
 * after:w-full stretched the underline across the whole panel, where it read
 * as a section divider rather than a marker, and the rows were bare text - a
 * ~20px target in a product that holds everything else to 44px.
 *
 * The marker is a left rule in the same red the desktop underline uses, over
 * a wash light enough to keep the red legible on it - accent-red measures
 * 5.3:1 on amber/20, against 3.33:1 on full amber, which is why the fill is
 * a wash and not a slab. A solid amber row was tried first and read as a
 * banner: it out-shouted the logo and flattened the three links beside it. */
const MOBILE_ROW =
  'flex min-h-11 items-center gap-2 rounded-control px-3 font-sans text-sm tracking-wide ' +
  'transition-[background-color,color] duration-fast ease-ui'

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    /* rounded-l-none: a 4px border on a rounded corner renders as a crescent
       hugging the curve rather than a rule. Squaring the leading edge is what
       makes it read as a marker. */
    ? `${MOBILE_ROW} rounded-l-none border-l-4 border-accent-red bg-amber/20 pl-2 font-bold uppercase text-accent-red`
    : `${MOBILE_ROW} font-semibold uppercase text-espresso-dark hover:bg-espresso-dark/5 hover:text-accent-red`

/* The action rows under the divider are not NavLinks, but they sit in the
 * same column and need the same target. */
const mobileActionClass =
  `${MOBILE_ROW} font-semibold text-espresso-dark hover:bg-espresso-dark/5 hover:text-accent-red`

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const { cartCount, openCart } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Close the account dropdown on an outside click or Escape.
  useEffect(() => {
    if (!accountOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [accountOpen])

  const go = (to: string) => {
    setAccountOpen(false)
    setMenuOpen(false)
    navigate(to)
  }

  const handleSignOut = () => {
    logout()
    setAccountOpen(false)
    setMenuOpen(false)
    navigate('/')
  }

  const cartBadge =
    cartCount > 0 ? (
      <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-red px-1 font-sans text-xs font-bold text-white">
        {cartCount}
      </span>
    ) : null

  return (
    <header className="sticky top-0 z-40 border-b border-espresso-dark/10 bg-nav-bg">
      {/* h-header pins this to --header-h so the sticky menu filter bar can
          offset from the same token instead of a hardcoded pixel guess. */}
      <div className="mx-auto flex h-header max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="shrink-0 cursor-pointer"
          onClick={() => go('/')}
          aria-label="BiteBox Home"
        >
          <img src={logoImg} alt="BiteBox Logo" className="h-12 w-auto" />
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-1 text-espresso-dark lg:flex">
          <button
            type="button"
            onClick={() => go('/track')}
            className="rounded-full p-2.5 transition-colors duration-fast ease-ui hover:bg-espresso-dark/10 hover:text-accent-red"
            aria-label="Track an order"
            title="Track an order"
          >
            <MapPin className="h-6 w-6" />
          </button>

          <div className="relative" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              className="flex items-center gap-1.5 rounded-full p-2.5 transition-colors duration-fast ease-ui hover:bg-espresso-dark/10 hover:text-accent-red"
              aria-label={user ? `Account menu for ${user.name}` : 'Sign in'}
              aria-expanded={accountOpen}
              aria-haspopup="menu"
            >
              <User className="h-6 w-6" />
              {user && (
                <span className="max-w-[7rem] truncate font-sans text-sm font-bold">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>

            {accountOpen && (
              <div
                role="menu"
                className="animate-pop-in absolute right-0 top-full z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-control border-2 border-ink-dark bg-card-bg shadow-comic"
              >
                {user ? (
                  <>
                    <div className="border-b-2 border-ink-dark px-4 py-3">
                      <p className="truncate font-sans text-sm font-bold text-ink-dark">
                        {user.name}
                      </p>
                      <p className="truncate font-sans text-xs text-ink-muted">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => go('/account')}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-sans text-sm font-semibold text-ink-dark transition-colors duration-fast ease-ui hover:bg-amber"
                    >
                      <Package className="h-4 w-4" /> My Orders
                    </button>
                    {user.role === 'ADMIN' && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => go('/admin')}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-sans text-sm font-semibold text-ink-dark transition-colors duration-fast ease-ui hover:bg-amber"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Admin Panel
                      </button>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      /* Amber hover would have dropped this to 3.16:1. A
                         destructive item reads better filled anyway. */
                      className="flex w-full items-center gap-2 border-t-2 border-ink-dark px-4 py-2.5 text-left font-sans text-sm font-semibold text-accent-red transition-colors duration-fast ease-ui hover:bg-accent-red hover:text-white"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => go('/login')}
                      className="w-full px-4 py-2.5 text-left font-sans text-sm font-semibold text-ink-dark transition-colors duration-fast ease-ui hover:bg-amber"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => go('/register')}
                      className="w-full border-t-2 border-ink-dark px-4 py-2.5 text-left font-sans text-sm font-semibold text-ink-dark transition-colors duration-fast ease-ui hover:bg-amber"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="relative rounded-full p-2.5 text-espresso-dark transition-colors duration-fast ease-ui hover:bg-accent-red/10 hover:text-accent-red"
            aria-label={`Cart with ${cartCount} items`}
            onClick={openCart}
          >
            <ShoppingBag className="h-6 w-6" />
            {cartBadge}
          </button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            className="relative rounded-full p-2.5 text-espresso-dark transition-colors duration-fast ease-ui hover:bg-espresso-dark/10 hover:text-accent-red"
            aria-label={`Cart with ${cartCount} items`}
            onClick={openCart}
          >
            <ShoppingBag className="h-6 w-6" />
            {cartBadge}
          </button>

          <button
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-espresso-dark/15"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className={`${bar} ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`${bar} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`${bar} ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="animate-rise-in border-t border-espresso-dark/10 bg-nav-bg px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-0.5">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-0.5 border-t border-espresso-dark/10 pt-3">
            <button
              type="button"
              className={mobileActionClass}
              onClick={() => go('/track')}
            >
              <MapPin className="h-5 w-5" aria-hidden="true" /> Track an Order
            </button>

            {user ? (
              <>
                <button
                  type="button"
                  className={mobileActionClass}
                  onClick={() => go('/account')}
                >
                  <Package className="h-5 w-5" aria-hidden="true" /> My Orders
                </button>
                {user.role === 'ADMIN' && (
                  <button
                    type="button"
                    className={mobileActionClass}
                    onClick={() => go('/admin')}
                  >
                    <LayoutDashboard className="h-5 w-5" aria-hidden="true" /> Admin Panel
                  </button>
                )}
                <button
                  type="button"
                  className={`${MOBILE_ROW} font-semibold text-accent-red hover:bg-accent-red hover:text-white`}
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" /> Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                className={mobileActionClass}
                onClick={() => go('/login')}
              >
                <User className="h-5 w-5" aria-hidden="true" /> Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
