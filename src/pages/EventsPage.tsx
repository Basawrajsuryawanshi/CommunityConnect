import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mountain } from 'lucide-react'
import { EventCard } from '../components/EventCard'
import { formatCurrency } from '../data/trekkingData'
import { isUpcoming, useApp } from '../context/AppContext'

type Filter = 'all' | 'upcoming' | 'past'
type Tab = 'events' | 'trekking'

export function EventsPage() {
  const { events, treks } = useApp()
  const [tab, setTab] = useState<Tab>('events')
  const [filter, setFilter] = useState<Filter>('upcoming')

  const filtered = events.filter((e) => {
    if (filter === 'upcoming') return isUpcoming(e.date)
    if (filter === 'past') return !isUpcoming(e.date)
    return true
  })

  const minRate = Math.min(...treks.map((t) => t.rate))

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Events</h1>
        <p className="mt-1 text-sm text-stone-500">
          Community gatherings, reunions, and alumni trekking adventures
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab('events')}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
            tab === 'events'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
          }`}
        >
          Community Events
        </button>
        <button
          type="button"
          onClick={() => setTab('trekking')}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition ${
            tab === 'trekking'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
          }`}
        >
          <Mountain className="h-4 w-4" />
          Trekking Adventures
        </button>
      </div>

      {tab === 'events' && (
        <>
          <div className="mb-6 flex gap-2">
            {(['upcoming', 'past', 'all'] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  filter === f
                    ? 'bg-stone-800 text-white'
                    : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-stone-500">No events found for this filter.</p>
          )}
        </>
      )}

      {tab === 'trekking' && (
        <div>
          <Link
            to="/events/trekking"
            className="group mb-6 block overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 transition hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                  <Mountain className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Alumni Trekking Adventures</h2>
                  <p className="mt-1 max-w-xl text-sm text-stone-600">
                    Browse trekking destinations across India — state-wise listings with rates.
                    Select a trek, book your slot, pay securely, and get instant confirmation.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white px-3 py-1 font-medium text-emerald-700 ring-1 ring-emerald-200">
                      {treks.length} treks
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 font-medium text-emerald-700 ring-1 ring-emerald-200">
                      From {formatCurrency(minRate)}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 font-medium text-emerald-700 ring-1 ring-emerald-200">
                      Instant confirmation
                    </span>
                  </div>
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-700 group-hover:gap-2">
                Explore Treks <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
