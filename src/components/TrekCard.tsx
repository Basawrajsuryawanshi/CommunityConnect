import { Link } from 'react-router-dom'
import { Clock, IndianRupee, MapPin, Mountain } from 'lucide-react'
import { formatCurrency } from '../data/trekkingData'
import type { Trek } from '../types/trekking'

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Moderate: 'bg-amber-100 text-amber-800',
  Difficult: 'bg-orange-100 text-orange-800',
  Expert: 'bg-red-100 text-red-800',
}

export function TrekCard({ trek }: { trek: Trek }) {
  const nextSlot = trek.slots.find((s) => s.availableSeats > 0)

  return (
    <Link
      to={`/events/trekking/${trek.id}`}
      className="group block overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md"
    >
      <div className={`h-28 bg-gradient-to-br ${trek.imageGradient} p-4`}>
        <div className="flex items-start justify-between">
          <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {trek.state}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${difficultyColors[trek.difficulty]}`}
          >
            {trek.difficulty}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-white/90">
          <Mountain className="h-4 w-4" />
          <span className="text-xs">{trek.duration}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 group-hover:text-emerald-700">{trek.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
          <MapPin className="h-3.5 w-3.5" />
          {trek.location}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-stone-500">{trek.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
          <div className="flex items-center gap-1 font-bold text-emerald-700">
            <IndianRupee className="h-4 w-4" />
            {formatCurrency(trek.rate).replace('₹', '')}
            <span className="text-xs font-normal text-stone-400">/ person</span>
          </div>
          {nextSlot ? (
            <span className="flex items-center gap-1 text-xs text-stone-500">
              <Clock className="h-3.5 w-3.5" />
              {nextSlot.availableSeats} slots left
            </span>
          ) : (
            <span className="text-xs font-medium text-red-500">Sold out</span>
          )}
        </div>
      </div>
    </Link>
  )
}
