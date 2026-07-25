import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react'
import { EventTypeBadge } from '../components/Badge'
import {
  formatDate,
  getRsvpCount,
  getUserRsvp,
  useApp,
} from '../context/AppContext'
import type { RsvpStatus } from '../types'

export function EventDetailPage() {
  const { id } = useParams()
  const { events, user, updateRsvp } = useApp()
  const event = events.find((e) => e.id === id)

  if (!event) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <p className="text-stone-500">Event not found.</p>
        <Link to="/events" className="mt-4 inline-block text-emerald-600 hover:underline">
          Back to events
        </Link>
      </div>
    )
  }

  const userRsvp = getUserRsvp(event, user.id)
  const going = getRsvpCount(event, 'going')
  const maybe = getRsvpCount(event, 'maybe')

  const rsvpOptions: { status: RsvpStatus; label: string; activeClass: string }[] = [
    { status: 'going', label: 'Going', activeClass: 'bg-emerald-600 text-white ring-emerald-600' },
    { status: 'maybe', label: 'Maybe', activeClass: 'bg-amber-500 text-white ring-amber-500' },
    {
      status: 'not_going',
      label: "Can't Go",
      activeClass: 'bg-stone-500 text-white ring-stone-500',
    },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/events"
        className="mb-6 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to events
      </Link>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className={`h-32 bg-gradient-to-r sm:h-40 ${event.imageGradient}`} />
        <div className="p-6 sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <EventTypeBadge type={event.type} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{event.title}</h1>
          <p className="mt-4 leading-relaxed text-stone-600">{event.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs text-stone-500">Date & Time</p>
                <p className="text-sm font-medium text-stone-900">
                  {formatDate(event.date)} · {event.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs text-stone-500">Location</p>
                <p className="text-sm font-medium text-stone-900">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
              <Users className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs text-stone-500">RSVPs</p>
                <p className="text-sm font-medium text-stone-900">
                  {going} going · {maybe} maybe · {event.capacity} capacity
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-sm font-medium text-stone-700">Your RSVP</p>
            <div className="flex flex-wrap gap-2">
              {rsvpOptions.map(({ status, label, activeClass }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    updateRsvp(event.id, userRsvp === status ? null : status)
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-medium ring-1 transition ${
                    userRsvp === status
                      ? activeClass
                      : 'bg-white text-stone-600 ring-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-xs text-stone-400">Organized by {event.organizer}</p>
        </div>
      </div>
    </div>
  )
}
