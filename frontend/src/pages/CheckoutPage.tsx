import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CheckoutSummary from '../sections/checkout/CheckoutSummary'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, cartCount, subtotal, deliveryFee, total, clearCart } = useCart()

  const handlePlaceOrder = () => {
    clearCart()
    navigate('/')
  }

  return (
    <main className="page-container max-w-3xl">
      <CheckoutSummary
        items={cart}
        cartCount={cartCount}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        onBackToMenu={() => navigate('/menu')}
        onPlaceOrder={handlePlaceOrder}
      />
    </main>
  )
}
