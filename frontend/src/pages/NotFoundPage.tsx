import { Link } from 'react-router-dom'
import { buttonClass } from '../components/common/Button'

/**
 * Unknown routes used to redirect to the home page, which silently swallowed
 * typos and dead links - the visitor arrived somewhere they did not ask for
 * with no explanation. This says what happened and offers the two places
 * they most likely wanted.
 */
export default function NotFoundPage() {
  return (
    <main className="page-container max-w-2xl">
      <div className="card-comic rounded-card p-8 text-center sm:p-12">
        <p className="font-display text-display-xl text-accent-red">404</p>
        <h1 className="mt-2 font-display text-display-md uppercase text-header-brown">
          That page is off the menu
        </h1>
        <p className="mt-3 font-sans text-body-lg text-ink-muted">
          The link may be out of date, or the address slightly off.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/menu" className={buttonClass({ size: 'md' })}>
            Browse the menu
          </Link>
          <Link
            to="/"
            className={buttonClass({ variant: 'secondary', size: 'md' })}
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  )
}
