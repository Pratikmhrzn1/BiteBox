import { Check, X } from 'lucide-react'
import { STATUS_FLOW, STATUS_LABELS } from '../../api/orders'
import type { OrderStatus, OrderType } from '../../api/orders'

type OrderStatusTrailProps = {
  status: OrderStatus
  orderType: OrderType
}

/**
 * Progress trail through the kitchen. The "on the way" step only applies to
 * deliveries, so it is dropped for dine-in and takeaway.
 */
export default function OrderStatusTrail({
  status,
  orderType,
}: OrderStatusTrailProps) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 rounded-control border-2 border-ink-dark bg-accent-red/10 px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-red">
          <X className="h-4 w-4 text-white" aria-hidden="true" />
        </span>
        <p className="font-sans text-sm font-bold text-ink-dark">
          This order was cancelled.
        </p>
      </div>
    )
  }

  const steps = STATUS_FLOW.filter(
    (step) => step !== 'OUT_FOR_DELIVERY' || orderType === 'DELIVERY',
  )
  const currentIndex = steps.indexOf(status)

  return (
    <ol className="flex flex-wrap items-start gap-y-3">
      {steps.map((step, index) => {
        const isDone = index <= currentIndex
        const isCurrent = index === currentIndex
        return (
          <li key={step} className="flex flex-1 items-center gap-2 min-w-[5.5rem]">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink-dark font-sans text-xs font-bold transition-colors duration-fast ease-ui ${
                  isDone ? 'bg-accent-red text-white' : 'bg-white text-ink-muted'
                } ${isCurrent ? 'ring-4 ring-amber' : ''}`}
                aria-hidden="true"
              >
                {isDone ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span
                className={`text-center font-sans text-[11px] font-bold uppercase leading-tight ${
                  isDone ? 'text-ink-dark' : 'text-ink-muted'
                }`}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span
                className={`mb-6 h-1 flex-1 rounded ${
                  index < currentIndex ? 'bg-accent-red' : 'bg-ink-muted/25'
                }`}
                aria-hidden="true"
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
