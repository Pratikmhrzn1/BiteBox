/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { MenuItem, MenuOption } from '../api/menu'
import type { OrderLineInput, OrderType } from '../api/orders'

export type CartItem = {
  /** Identity of a line: same dish with different options is a separate line. */
  key: string
  slug: string
  name: string
  image: string
  /** Price of the chosen size, or the dish's base price. */
  unitPrice: number
  size: MenuOption | null
  extras: MenuOption[]
  quantity: number
}

export const DELIVERY_FEE = 50

const CART_KEY = 'bitebox_cart'
const ORDER_TYPE_KEY = 'bitebox_order_type'

export const cartLineTotal = (item: CartItem): number =>
  (item.unitPrice + item.extras.reduce((sum, extra) => sum + extra.price, 0)) *
  item.quantity

const buildKey = (slug: string, size: MenuOption | null, extras: MenuOption[]) =>
  `${slug}::${size?.id ?? ''}::${extras.map((extra) => extra.id).sort().join('|')}`

const readStoredCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Anything malformed is dropped rather than crashing the whole app on boot.
    return parsed.filter(
      (line): line is CartItem =>
        typeof line === 'object' &&
        line !== null &&
        typeof (line as CartItem).slug === 'string' &&
        typeof (line as CartItem).quantity === 'number',
    )
  } catch {
    return []
  }
}

const readStoredOrderType = (): OrderType => {
  const stored = localStorage.getItem(ORDER_TYPE_KEY)
  return stored === 'DINE_IN' || stored === 'TAKEAWAY' || stored === 'DELIVERY'
    ? stored
    : 'DELIVERY'
}

type CartContextValue = {
  cart: CartItem[]
  cartCount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (
    item: MenuItem,
    quantity: number,
    options?: { size?: MenuOption | null; extras?: MenuOption[] },
  ) => void
  updateQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clearCart: () => void
  orderType: OrderType
  setOrderType: (orderType: OrderType) => void
  subtotal: number
  deliveryFee: number
  total: number
  /** The cart in the shape `POST /orders` expects — quantities, never prices. */
  toOrderLines: () => OrderLineInput[]
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(readStoredCart)
  const [orderType, setOrderTypeState] = useState<OrderType>(readStoredOrderType)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Persist so a refresh mid-order does not lose the basket.
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(ORDER_TYPE_KEY, orderType)
  }, [orderType])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const setOrderType = useCallback((next: OrderType) => setOrderTypeState(next), [])

  const addItem = useCallback<CartContextValue['addItem']>(
    (item, quantity, options) => {
      const size = options?.size ?? null
      const extras = options?.extras ?? []
      const key = buildKey(item.slug, size, extras)

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
            slug: item.slug,
            name: item.name,
            image: item.image,
            unitPrice: size?.price ?? item.price,
            size,
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
      quantity <= 0
        ? current.filter((line) => line.key !== key)
        : current.map((line) =>
            line.key === key ? { ...line, quantity } : line,
          ),
    )
  }, [])

  const removeItem = useCallback((key: string) => {
    setCart((current) => current.filter((line) => line.key !== key))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toOrderLines = useCallback(
    (): OrderLineInput[] =>
      cart.map((line) => ({
        menuItem: line.slug,
        quantity: line.quantity,
        ...(line.size ? { size: line.size.id } : {}),
        ...(line.extras.length
          ? { extras: line.extras.map((extra) => extra.id) }
          : {}),
      })),
    [cart],
  )

  const value = useMemo<CartContextValue>(() => {
    const subtotal = cart.reduce((sum, line) => sum + cartLineTotal(line), 0)
    const deliveryFee = orderType === 'DELIVERY' && cart.length > 0 ? DELIVERY_FEE : 0

    return {
      cart,
      cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      orderType,
      setOrderType,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      toOrderLines,
    }
  }, [
    cart,
    isCartOpen,
    orderType,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    setOrderType,
    toOrderLines,
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
