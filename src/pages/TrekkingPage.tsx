import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Mountain } from 'lucide-react'
import { TrekCard } from '../components/TrekCard'
import { formatCurrency, getTrekStates } from '../data/trekkingData'
import { useApp } from '../context/AppContext'

export function TrekkingPage() {
  const { treks } = useApp()
  const states = getTrekStates()
  const [stateFilter, setStateFilter] = useState('all')

  const filtered = useMemo(() => {
    if (stateFilter === 'all') return treks
    return treks.filter((t) => t.state === stateFilter)
  }, [treks, stateFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof treks>()
    for (const trek of filtered) {
      const list = map.get(trek.state) ?? []
      list.push(trek)
      map.set(trek.state, list)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/events"
        className="mb-4 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 p-6 text-white sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Mountain className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Alumni Trekking Adventures</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/85">
              Explore India's finest trekking destinations state-wise. Select a trek, book your slot,
              and pay securely — receive instant confirmation for your adventure.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-white/15 px-3 py-1">{treks.length} treks available</span>
          <span className="rounded-full bg-white/15 px-3 py-1">{states.length} states</span>
          <span className="rounded-full bg-white/15 px-3 py-1">
            From {formatCurrency(Math.min(...treks.map((t) => t.rate)))}
          </span>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStateFilter('all')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            stateFilter === 'all'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
          }`}
        >
          All States
        </button>
        {states.map((state) => (
          <button
            key={state}
            type="button"
            onClick={() => setStateFilter(state)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              stateFilter === state
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      <div className="space-y-10">
        {grouped.map(([state, stateTreks]) => (
          <section key={state}>
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-stone-900">{state}</h2>
              <span className="text-sm text-stone-400">
                {stateTreks.length} trek{stateTreks.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stateTreks.map((trek) => (
                <TrekCard key={trek.id} trek={trek} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-stone-500">No treks found for this state.</p>
      )}
    </div>
  )
}
