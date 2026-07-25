import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Megaphone, Sparkles, Users } from 'lucide-react'
import { AnnouncementCard } from '../components/AnnouncementCard'
import { EventCard } from '../components/EventCard'
import { formatDate, isUpcoming, useApp } from '../context/AppContext'
import { VerifiedBadge } from '../components/Badge'

export function DashboardPage() {
  const { community, events, announcements, discussions, user } = useApp()

  const upcomingEvents = events.filter((e) => isUpcoming(e.date)).slice(0, 3)
  const pinnedAnnouncements = announcements.filter((a) => a.pinned).slice(0, 2)
  const recentDiscussions = discussions.slice(0, 2)

  const stats = [
    { label: 'Members', value: community.memberCount.toLocaleString('en-IN'), icon: Users },
    { label: 'Upcoming Events', value: upcomingEvents.length, icon: Calendar },
    { label: 'Announcements', value: announcements.length, icon: Megaphone },
    { label: 'Discussions', value: discussions.length, icon: Sparkles },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section
        className={`overflow-hidden rounded-2xl bg-gradient-to-br ${community.coverGradient} p-6 text-white shadow-lg sm:p-8`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2">
              <VerifiedBadge label="Verified Community" />
            </div>
            <h1 className="font-serif text-3xl font-normal sm:text-4xl">{community.name}</h1>
            <p className="mt-1 text-lg text-white/90">{community.tagline}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
              {community.description}
            </p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold">{community.memberCount.toLocaleString('en-IN')}</p>
            <p className="text-xs text-white/80">Verified Members</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-white/70">
          Welcome back, {user.name}! · Batch {user.batch}, {user.jnv}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
          >
            <Icon className="mb-2 h-5 w-5 text-emerald-600" />
            <p className="text-2xl font-bold text-stone-900">{value}</p>
            <p className="text-xs text-stone-500">{label}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">Upcoming Events</h2>
          <Link
            to="/events"
            className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">Announcements</h2>
            <Link
              to="/announcements"
              className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {pinnedAnnouncements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">Recent Discussions</h2>
            <Link
              to="/discussions"
              className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentDiscussions.map((d) => (
              <div
                key={d.id}
                className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
              >
                <h3 className="font-medium text-stone-900">{d.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-stone-500">{d.content}</p>
                <p className="mt-2 text-xs text-stone-400">
                  {d.author} · {formatDate(d.createdAt)} · {d.replies.length} replies
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
        <h2 className="font-semibold text-emerald-900">Platform Vision</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-800/80">
          CommunityConnect is building India's leading platform for verified communities — starting
          with JNV Alumni and expanding to colleges, corporates, apartment communities, NGOs, and
          sports clubs. Future enhancements include job boards, mentorship, referrals, marketplaces,
          and AI-powered recommendations.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Job Board', 'Mentorship', 'Referrals', 'Marketplace', 'Mobile App', 'AI Recommendations'].map(
            (feature) => (
              <span
                key={feature}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
              >
                {feature} — Coming Soon
              </span>
            ),
          )}
        </div>
      </section>
    </div>
  )
}
