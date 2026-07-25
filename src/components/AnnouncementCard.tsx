import { Pin } from 'lucide-react'
import { formatDate } from '../context/AppContext'
import type { Announcement } from '../types'
import { CategoryBadge } from './Badge'

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <article
      className={`rounded-xl border bg-white p-5 shadow-sm ${
        announcement.pinned ? 'border-amber-200 bg-amber-50/30' : 'border-stone-200'
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {announcement.pinned && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
            <Pin className="h-3 w-3" />
            Pinned
          </span>
        )}
        <CategoryBadge category={announcement.category} />
        <span className="text-xs text-stone-400">{formatDate(announcement.createdAt)}</span>
      </div>
      <h3 className="text-lg font-semibold text-stone-900">{announcement.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{announcement.content}</p>
      <p className="mt-3 text-xs text-stone-400">Posted by {announcement.author}</p>
    </article>
  )
}
