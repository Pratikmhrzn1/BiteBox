import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  ORDER_TYPES,
  PAYMENT_METHODS,
  placeOrder,
  type CreateOrderInput,
  type PaymentMethod,
} from '../api/orders'
import { formatPrice } from '../utils'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/common/Toast'
import { fieldClass, focusFirstError, labelClass } from '../components/common/formStyles'
import FormField from '../components/common/FormField'
import CheckoutSummary from '../sections/checkout/CheckoutSummary'
import { buttonClass } from '../components/common/Button'

type CustomerForm = {
  name: string
  phone: string
  address: string
  note: string
}

type Errors = Partial<Record<'name' | 'phone' | 'address', string>>

const PHONE_RE = /^\+?[\d\s-]{7,20}$/

const FIELD_ORDER = [
  ['name', 'checkout-name'],
  ['phone', 'checkout-phone'],
  ['address', 'checkout-address'],
] as const

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { notify } = useToast()
  const {
    cart,
    cartCount,
    subtotal,
    deliveryFee,
    total,
    orderType,
    setOrderType,
    clearCart,
    toOrderLines,
  } = useCart()

  const [customer, setCustomer] = useState<CustomerForm>({
    name: '',
    phone: '',
    address: '',
    note: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY')
  const [errors, setErrors] = useState<Errors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Prefill from the signed-in profile once, during render, and only into
  // fields the customer has not already typed into.
  const [prefilledFor, setPrefilledFor] = useState<string | null>(null)
  if (user && user.id !== prefilledFor) {
    setPrefilledFor(user.id)
    setCustomer((current) => ({
      ...current,
      name: current.name || user.name,
      phone: current.phone || (user.phone ?? ''),
    }))
  }

  if (cart.length === 0 && !submitting) {
    return (
      <main className="page-container max-w-3xl">
        <div className="card-comic rounded-card bg-card-bg p-8 text-center sm:p-12">
          <h1 className="font-display text-display-md uppercase text-header-brown">
            Your box is empty
          </h1>
          <p className="mt-2 font-sans text-body-lg text-ink-muted">
            Add a dish or two and come back to check out.
          </p>
          <Link to="/menu" className={buttonClass({ size: 'md', className: 'mt-6' })}>
            Browse the menu
          </Link>
        </div>
      </main>
    )
  }

  const update =
    (field: keyof CustomerForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target
      setCustomer((current) => ({ ...current, [field]: value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
    }

  const validate = (): Errors => {
    const next: Errors = {}
    if (!customer.name.trim()) next.name = 'We need a name for the order'
    if (!customer.phone.trim()) next.phone = 'We need a phone number to reach you'
    else if (!PHONE_RE.test(customer.phone.trim()))
      next.phone = 'That phone number looks off'
    if (orderType === 'DELIVERY' && !customer.address.trim())
      next.address = 'Where should we deliver it?'
    return next
  }

  const handlePlaceOrder = async () => {
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setSubmitError('Please fix the highlighted fields.')
      focusFirstError(FIELD_ORDER, nextErrors)
      return
    }

    const order: CreateOrderInput = {
      customerName: customer.name.trim(),
      customerPhone: customer.phone.trim(),
      customerAddress: customer.address.trim() || undefined,
      customerNote: customer.note.trim() || undefined,
      items: toOrderLines(),
      orderType,
      paymentMethod,
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      const placed = await placeOrder(order)
      clearCart()
      notify(`Order ${placed.reference} is in!`)
      navigate(`/order/${placed.reference}`, {
        replace: true,
        state: { order: placed },
      })
    } catch (reason) {
      setSubmitError(
        reason instanceof Error
          ? reason.message
          : 'Could not place your order. Please try again.',
      )
      setSubmitting(false)
    }
  }

  if (cart.length === 0 && submitting) return <Navigate to="/" replace />

  return (
    <main className="page-container max-w-3xl">
      <CheckoutSummary
        items={cart}
        cartCount={cartCount}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        onBackToMenu={() => navigate('/menu')}
        onPlaceOrder={() => void handlePlaceOrder()}
        submitting={submitting}
      />

      <div className="card-comic mt-6 rounded-card p-6 sm:p-8">
        <h2 className="font-display text-display-md uppercase text-header-brown">
          Your Details
        </h2>

        <div className="mt-5 space-y-5">
          <div>
            <p className={labelClass}>
              How would you like it? <span className="text-accent-red">*</span>
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ORDER_TYPES.map((type) => {
                const selected = orderType === type.value
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setOrderType(type.value)}
                    aria-pressed={selected}
                    className={`rounded-control border-2 p-3 text-left transition-colors duration-fast ease-ui ${
                      selected
                        ? 'border-accent-red bg-amber shadow-comic-sm'
                        : 'border-ink-dark bg-white hover:bg-cream/50'
                    }`}
                  >
                    <span className="block font-sans text-sm font-bold text-ink-dark">
                      {type.label}
                    </span>
                    <span className="mt-0.5 block font-sans text-xs text-ink-muted">
                      {type.hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="checkout-name"
              label="Full Name"
              error={errors.name}
              required
            >
              {(control) => (
                <input
                  {...control}
                  type="text"
                  autoComplete="name"
                  value={customer.name}
                  onChange={update('name')}
                  placeholder="Zoe Smashburger"
                  className={fieldClass(Boolean(errors.name))}
                />
              )}
            </FormField>
            <FormField
              id="checkout-phone"
              label="Phone Number"
              error={errors.phone}
              required
            >
              {(control) => (
                <input
                  {...control}
                  type="tel"
                  autoComplete="tel"
                  value={customer.phone}
                  onChange={update('phone')}
                  placeholder="+977 …"
                  className={fieldClass(Boolean(errors.phone))}
                />
              )}
            </FormField>
          </div>

          {orderType === 'DELIVERY' && (
            <FormField
              id="checkout-address"
              label="Delivery Address"
              error={errors.address}
              required
            >
              {(control) => (
                <input
                  {...control}
                  type="text"
                  autoComplete="street-address"
                  value={customer.address}
                  onChange={update('address')}
                  placeholder="Nakhipot, Lalitpur"
                  className={fieldClass(Boolean(errors.address))}
                />
              )}
            </FormField>
          )}

          <FormField
            id="checkout-note"
            label="Order Note"
            hint="Optional. Allergies, buzzer codes, sauce opinions."
          >
            {(control) => (
              <textarea
                {...control}
                rows={3}
                value={customer.note}
                onChange={update('note')}
                placeholder="Extra sauce on the side…"
                className={`${fieldClass(false)} resize-none`}
              />
            )}
          </FormField>

          <div>
            <p className={labelClass}>
              Payment Method <span className="text-accent-red">*</span>
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PAYMENT_METHODS.map((method) => {
                const selected = paymentMethod === method.value
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    aria-pressed={selected}
                    className={`rounded-control border-2 p-3 text-left transition-colors duration-fast ease-ui ${
                      selected
                        ? 'border-accent-red bg-amber shadow-comic-sm'
                        : 'border-ink-dark bg-white hover:bg-cream/50'
                    }`}
                  >
                    <span className="block font-sans text-sm font-bold text-ink-dark">
                      {method.label}
                    </span>
                    <span className="mt-0.5 block font-sans text-xs text-ink-muted">
                      {method.hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {!user && (
            <p className="rounded-control border-2 border-dashed border-ink-dark bg-white/60 px-4 py-3 font-sans text-sm text-ink-muted">
              Ordering as a guest.{' '}
              <Link to="/login" className="font-bold text-accent-red hover:underline">
                Sign in
              </Link>{' '}
              to save this order to your history.
            </p>
          )}

          {submitError && (
            <p className="font-sans text-sm font-semibold text-accent-red" role="alert">
              {submitError}
            </p>
          )}

          <button
            type="button"
            onClick={() => void handlePlaceOrder()}
            disabled={submitting}
            className={buttonClass({ size: 'lg', className: 'w-full' })}
          >
            {submitting ? 'Placing order…' : `Place Order · ${formatPrice(total)}`}
          </button>
        </div>
      </div>
    </main>
  )
}
