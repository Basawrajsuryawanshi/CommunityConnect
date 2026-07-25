import { AnnouncementCard } from '../components/AnnouncementCard'
import { useApp } from '../context/AppContext'

export function AnnouncementsPage() {
  const { announcements } = useApp()
  const pinned = announcements.filter((a) => a.pinned)
  const regular = announcements.filter((a) => !a.pinned)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Announcements</h1>
        <p className="mt-1 text-sm text-stone-500">
          Stay updated with community news, opportunities, and celebrations
        </p>
      </div>

      {pinned.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-stone-500 uppercase">
            Pinned
          </h2>
          <div className="space-y-4">
            {pinned.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-stone-500 uppercase">
          Recent
        </h2>
        <div className="space-y-4">
          {regular.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      </section>
    </div>
  )
}
