import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users } from 'lucide-react'
import { formatDate, getRsvpCount, getUserRsvp, useApp } from '../context/AppContext'
import type { Event } from '../types'
import { EventTypeBadge } from './Badge'

export function EventCard({ event, compact = false }: { event: Event; compact?: boolean }) {
  const { user } = useApp()
  const going = getRsvpCount(event, 'going')
  const userRsvp = getUserRsvp(event, user.id)

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md"
    >
      <div className={`h-2 bg-gradient-to-r ${event.imageGradient}`} />
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <EventTypeBadge type={event.type} />
          {userRsvp === 'going' && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              You're going
            </span>
          )}
        </div>
        <h3 className="font-semibold text-stone-900 group-hover:text-emerald-700">
          {event.title}
        </h3>
        {!compact && (
          <p className="mt-1 line-clamp-2 text-sm text-stone-500">{event.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(event.date)} · {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.location.length > 30 ? event.location.slice(0, 30) + '…' : event.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {going} going
          </span>
        </div>
      </div>
    </Link>
  )
}
