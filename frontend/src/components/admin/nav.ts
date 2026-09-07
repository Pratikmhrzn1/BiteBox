import {
  BarChart3,
  LayoutDashboard,
  Mail,
  Megaphone,
  ShoppingCart,
  Star,
  Users,
  UtensilsCrossed,
} from 'lucide-react'

export const ADMIN_SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', Icon: ShoppingCart },
  { id: 'menu', label: 'Menu', Icon: UtensilsCrossed },
  { id: 'customers', label: 'Customers', Icon: Users },
  { id: 'messages', label: 'Messages', Icon: Mail },
  { id: 'reviews', label: 'Reviews', Icon: Star },
  { id: 'content', label: 'Content', Icon: Megaphone },
  { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
] as const

export type AdminSection = (typeof ADMIN_SECTIONS)[number]['id']
