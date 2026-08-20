/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartExtra } from '../data/menu'

export type CartItem = {
  key: string
  itemId: string
  name: string
  price: number
  image: string
  extras: CartExtra[]
  quantity: number
}

export type CartAddInput = {
  id: string
  name: string
  price: number
  image: string
}

export const cartLineTotal = (item: CartItem) =>
  (item.price + item.extras.reduce((sum, extra) => sum + extra.price, 0)) *
  item.quantity

type CartContextValue = {
  cart: CartItem[]
  cartCount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: CartAddInput, quantity: number, extras?: CartExtra[]) => void
  updateQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clearCart: () => void
  subtotal: number
  deliveryFee: number
  total: number
}

const CartContext = createContext<CartContextValue | null>(null)

const buildKey = (itemId: string, extras: CartExtra[]) =>
  `${itemId}:${extras.map((extra) => extra.id).sort().join('|')}`

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const addItem = useCallback(
    (item: CartAddInput, quantity: number, extras: CartExtra[] = []) => {
      const key = buildKey(item.id, extras)
      setCart((current) => {
        const existing = current.find((line) => line.key === key)
        if (existing) {
          return current.map((line) =>
            line.key === key
              ? { ...line, quantity: line.quantity + quantity }
              : line,
          )
        }
        return [
          ...current,
          {
            key,
            itemId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            extras,
            quantity,
          },
        ]
      })
    },
    [],
  )

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCart((current) =>
      current.map((line) =>
        line.key === key
          ? { ...line, quantity: Math.max(1, quantity) }
          : line,
      ),
    )
  }, [])

  const removeItem = useCallback((key: string) => {
    setCart((current) => current.filter((line) => line.key !== key))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const value = useMemo<CartContextValue>(() => {
    const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0)
    const deliveryFee = 50
    const subtotal = cart.reduce(
      (sum, line) => sum + cartLineTotal(line),
      0,
    )
    return {
      cart,
      cartCount,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    }
  }, [
    cart,
    isCartOpen,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}