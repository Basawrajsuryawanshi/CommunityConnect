import { BadgeCheck } from 'lucide-react'

export function VerifiedBadge({ label = 'Verified' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
      <BadgeCheck className="h-3 w-3" />
      {label}
    </span>
  )
}

export function CategoryBadge({
  category,
}: {
  category: 'general' | 'opportunity' | 'update' | 'celebration'
}) {
  const styles = {
    general: 'bg-stone-100 text-stone-700 ring-stone-200',
    opportunity: 'bg-blue-50 text-blue-700 ring-blue-200',
    update: 'bg-amber-50 text-amber-700 ring-amber-200',
    celebration: 'bg-pink-50 text-pink-700 ring-pink-200',
  }

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ${styles[category]}`}
    >
      {category}
    </span>
  )
}

export function EventTypeBadge({
  type,
}: {
  type: 'reunion' | 'meetup' | 'webinar' | 'workshop'
}) {
  const styles = {
    reunion: 'bg-amber-100 text-amber-800',
    meetup: 'bg-violet-100 text-violet-800',
    webinar: 'bg-blue-100 text-blue-800',
    workshop: 'bg-rose-100 text-rose-800',
  }

  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${styles[type]}`}>
      {type}
    </span>
  )
}

export function RoleBadge({ role }: { role: 'admin' | 'moderator' | 'member' | 'eventorganizer' }) {
  if (role === 'member') return null

  const styles = {
    admin: 'bg-emerald-100 text-emerald-800',
    moderator: 'bg-sky-100 text-sky-800',
    eventorganizer: 'bg-purple-100 text-purple-800',
    member: '',
  }

  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium capitalize ${styles[role]}`}>
      {role === 'eventorganizer' ? 'Event Organizer' : role}
    </span>
  )
}
