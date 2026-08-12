import { Link } from 'react-router-dom'

export function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-white p-10 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">403 Forbidden</p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-900">You do not have permission</h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          The page you attempted to access is restricted. If you believe this is an error, please contact your community administrator or try a different section.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Back to dashboard
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            Sign in as another user
          </Link>
        </div>
      </div>
    </div>
  )
}
