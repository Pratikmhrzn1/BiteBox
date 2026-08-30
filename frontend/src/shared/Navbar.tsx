import { useState } from 'react'
import { ShoppingBag, User } from 'lucide-react'
import { logoImg } from '../assets'
import { navLinks } from '../data/data'
import { useCart } from '../context/CartContext'

type NavbarProps = {
  activeLink?: string
  onSelectLink?: (label: string) => void
}

const bar = 'h-0.5 w-6 rounded bg-accent-red transition'

export default function Navbar({ activeLink = 'Home', onSelectLink }: NavbarProps) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const { cartCount, openCart } = useCart()

  const handleNavClick = (label: string) => {
    setHamburgerOpen(false)
    onSelectLink?.(label)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-espresso-dark/10 bg-cream bg-backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="shrink-0 cursor-pointer"
          onClick={() => handleNavClick('Home')}
          aria-label="BiteBox Home"
        >
          <img src={logoImg} alt="BiteBox Logo" className="h-12 w-auto" />
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive = link === activeLink
            return (
              <button
                key={link}
                type="button"
                onClick={() => handleNavClick(link)}
                className={
                  isActive
                    ? 'relative font-sans text-sm font-bold tracking-wide text-accent-red uppercase after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded after:bg-accent-red'
                    : 'font-sans text-sm font-semibold tracking-wide text-espresso-dark uppercase transition hover:text-accent-red'
                }
              >
                {link}
              </button>
            )
          })}
        </nav>

        <div className="hidden items-center gap-1 text-espresso-dark lg:flex">
          <button
            type="button"
            className="rounded-full p-2.5 transition hover:bg-espresso-dark/10 hover:text-accent-red"
            aria-label="Account"
          >
            <User className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="relative rounded-full p-2.5 text-espresso-dark transition hover:bg-accent-red/10 hover:text-accent-red"
            aria-label={`Cart with ${cartCount} items`}
            onClick={openCart}
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-red px-1 font-sans text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            className="relative rounded-full p-2.5 text-espresso-dark transition hover:bg-espresso-dark/10 hover:text-accent-red"
            aria-label={`Cart with ${cartCount} items`}
            onClick={openCart}
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-red px-1 font-sans text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-espresso-dark/15"
            onClick={() => setHamburgerOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={hamburgerOpen}
          >
            <span
              className={
                `${bar} ${hamburgerOpen ? 'translate-y-2 rotate-45' : ''}`
              }
            />
            <span
              className={`${bar} ${hamburgerOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={
                `${bar} ${hamburgerOpen ? '-translate-y-2 -rotate-45' : ''}`
              }
            />
          </button>
        </div>
      </div>

      {hamburgerOpen && (
        <div className="border-t border-espresso-dark/10 bg-cream px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = link === activeLink
              return (
                <button
                  key={link}
                  type="button"
                  onClick={() => handleNavClick(link)}
                  className={
                    isActive
                      ? 'text-left font-sans text-sm font-bold text-accent-red uppercase'
                      : 'text-left font-sans text-sm font-semibold text-espresso-dark uppercase'
                  }
                >
                  {link}
                </button>
              )
            })}
          </nav>
          <button
            type="button"
            className="mt-4 flex w-full items-center gap-2 rounded-lg border-t border-espresso-dark/10 px-2 pt-4 font-sans text-sm font-semibold text-espresso-dark transition hover:text-accent-red"
            onClick={() => setHamburgerOpen(false)}
          >
            <User className="h-5 w-5" aria-hidden="true" />
            Login
          </button>
        </div>
      )}
    </header>
  )
}