import {
  Users,
  CalendarDays,
  UserPlus,
  Flag,
  Megaphone,
  ArrowRight,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Activity,
  UserCheck,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const stats = [
  {
    label: 'Total Members',
    value: '452',
    change: '+18 this month',
    icon: Users,
    iconClass: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'Upcoming Events',
    value: '12',
    change: '3 this week',
    icon: CalendarDays,
    iconClass: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Pending Requests',
    value: '8',
    change: 'Needs attention',
    icon: UserPlus,
    iconClass: 'bg-amber-50 text-amber-600',
  },
  {
    label: 'Open Reports',
    value: '3',
    change: 'Requires review',
    icon: Flag,
    iconClass: 'bg-rose-50 text-rose-600',
  },
]

const recentMembers = [
  {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    batch: '2014',
    joined: 'Today',
  },
  {
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    batch: '2016',
    joined: 'Yesterday',
  },
  {
    name: 'Amit Sharma',
    email: 'amit.sharma@example.com',
    batch: '2012',
    joined: '2 days ago',
  },
  {
    name: 'Neha Patil',
    email: 'neha.patil@example.com',
    batch: '2018',
    joined: '3 days ago',
  },
]

const upcomingEvents = [
  {
    title: 'Annual Alumni Meet',
    date: '24 Aug 2026',
    time: '10:00 AM',
    attendees: 128,
    status: 'Published',
  },
  {
    title: 'Community Trekking Event',
    date: '30 Aug 2026',
    time: '6:30 AM',
    attendees: 46,
    status: 'Published',
  },
  {
    title: 'Career Guidance Session',
    date: '05 Sep 2026',
    time: '4:00 PM',
    attendees: 72,
    status: 'Pending Approval',
  },
]

const pendingItems = [
  {
    title: 'New member requests',
    description: '8 members are waiting for approval',
    icon: UserPlus,
    type: 'Members',
  },
  {
    title: 'Event approval',
    description: 'Career Guidance Session needs review',
    icon: CalendarDays,
    type: 'Events',
  },
  {
    title: 'Reported content',
    description: '3 reports require your attention',
    icon: Flag,
    type: 'Reports',
  },
]

const recentActivity = [
  {
    text: 'Rahul Kumar joined the community',
    time: '10 minutes ago',
    icon: UserCheck,
    type: 'Member',
  },
  {
    text: 'Annual Alumni Meet was published',
    time: '1 hour ago',
    icon: CalendarDays,
    type: 'Event',
  },
  {
    text: 'New announcement was published',
    time: '3 hours ago',
    icon: Megaphone,
    type: 'Announcement',
  },
  {
    text: 'A member report was submitted',
    time: '5 hours ago',
    icon: Flag,
    type: 'Report',
  },
]

export function CommunityDashboardPage() {
  const navigate = useNavigate()
  const { communityId } = useParams()

  const communityName = 'JNV Bidar'

  const goTo = (path: string) => {
    if (!communityId) return

    navigate(`/community/${communityId}/${path}`)
  }

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="min-w-0">

            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Community Admin
              </span>

              <span className="text-xs text-stone-400">
                Community ID: {communityId ?? 'N/A'}
              </span>
            </div>

            <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
              Welcome back, Community Admin
            </h1>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Manage members, events, announcements, and activities
              for <span className="font-semibold text-stone-900">{communityName}</span>.
            </p>

          </div>

          <button
            type="button"
            onClick={() => goTo('members')}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Users className="h-4 w-4" />
            Manage Members
          </button>

        </div>
      </section>

      {/* ================================================= */}
      {/* STAT CARDS */}
      {/* ================================================= */}

      <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="min-w-0 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-stone-900">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-xs font-medium text-stone-500">
                    {stat.change}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${stat.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

              </div>
            </div>
          )
        })}

      </section>

      {/* ================================================= */}
      {/* QUICK ACTIONS */}
      {/* ================================================= */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-stone-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Frequently used community management actions.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <QuickAction
            icon={Users}
            title="Manage Members"
            description="Review and manage community members."
            onClick={() => goTo('members')}
          />

          <QuickAction
            icon={CalendarDays}
            title="Manage Events"
            description="Create and manage community events."
            onClick={() => goTo('events')}
          />

          <QuickAction
            icon={Megaphone}
            title="Announcements"
            description="Publish important community updates."
            onClick={() => goTo('announcements')}
          />

          <QuickAction
            icon={Flag}
            title="Review Reports"
            description="Review reported content and members."
            onClick={() => goTo('reports')}
          />

        </div>
      </section>

      {/* ================================================= */}
      {/* MAIN GRID */}
      {/* ================================================= */}

      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* UPCOMING EVENTS */}

        <section className="min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

          <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-6 py-5">

            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                Upcoming Events
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Events happening in your community.
              </p>
            </div>

            <button
              type="button"
              onClick={() => goTo('events')}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>

          <div className="divide-y divide-stone-200">

            {upcomingEvents.map((event) => (

              <div
                key={event.title}
                className="p-5 transition hover:bg-stone-50"
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <h3 className="truncate font-semibold text-stone-900">
                        {event.title}
                      </h3>

                      {event.status === 'Published' ? (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                          Published
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                          Pending
                        </span>
                      )}

                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">

                      <span>
                        {event.date}
                      </span>

                      <span>
                        {event.time}
                      </span>

                      <span>
                        {event.attendees} attendees
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => goTo('events')}
                    className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* PENDING ACTIONS */}

        <section className="min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

          <div className="border-b border-stone-200 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-stone-900">
                  Needs Attention
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Items requiring your action.
                </p>
              </div>

            </div>

          </div>

          <div className="divide-y divide-stone-200">

            {pendingItems.map((item) => {
              const Icon = item.icon

              const path =
                item.type === 'Members'
                  ? 'members'
                  : item.type === 'Events'
                    ? 'events'
                    : 'reports'

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => goTo(path)}
                  className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-stone-50"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                    <Icon className="h-5 w-5 text-stone-600" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold text-stone-900">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {item.description}
                    </p>

                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-stone-400" />

                </button>
              )
            })}

          </div>

        </section>

      </div>

      {/* ================================================= */}
      {/* RECENT MEMBERS + ACTIVITY */}
      {/* ================================================= */}

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">

        {/* RECENT MEMBERS */}

        <section className="min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

          <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-6 py-5">

            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                Recent Members
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Recently joined community members.
              </p>
            </div>

            <button
              type="button"
              onClick={() => goTo('members')}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>

          <div className="divide-y divide-stone-200">

            {recentMembers.map((member) => (

              <div
                key={member.email}
                className="flex items-center gap-3 p-5"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  {member.name
                    .split(' ')
                    .map((name) => name[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-semibold text-stone-900">
                    {member.name}
                  </p>

                  <p className="truncate text-xs text-stone-500">
                    {member.email}
                  </p>

                </div>

                <div className="hidden shrink-0 text-right sm:block">

                  <p className="text-xs font-semibold text-stone-700">
                    Batch {member.batch}
                  </p>

                  <p className="mt-1 text-[11px] text-stone-400">
                    {member.joined}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* RECENT ACTIVITY */}

        <section className="min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

          <div className="border-b border-stone-200 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                <Activity className="h-5 w-5 text-sky-600" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-stone-900">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Latest activity in your community.
                </p>
              </div>

            </div>

          </div>

          <div className="divide-y divide-stone-200">

            {recentActivity.map((activity) => {
              const Icon = activity.icon

              return (
                <div
                  key={`${activity.text}-${activity.time}`}
                  className="flex items-start gap-4 p-5"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                    <Icon className="h-4 w-4 text-stone-600" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm text-stone-800">
                      {activity.text}
                    </p>

                    <div className="mt-1 flex items-center gap-2">

                      <Clock3 className="h-3 w-3 text-stone-400" />

                      <span className="text-xs text-stone-400">
                        {activity.time}
                      </span>

                    </div>

                  </div>

                </div>
              )
            })}

          </div>

        </section>

      </div>

      {/* ================================================= */}
      {/* COMMUNITY HEALTH */}
      {/* ================================================= */}

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-stone-900">
              Community Overview
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Current health of your community.
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-700">
                Community is healthy
              </p>

              <p className="text-xs text-stone-500">
                No major issues detected
              </p>
            </div>

          </div>

        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <HealthItem
            label="Member Engagement"
            value="86%"
          />

          <HealthItem
            label="Event Participation"
            value="74%"
          />

          <HealthItem
            label="Announcement Reach"
            value="92%"
          />

        </div>

      </section>

    </div>
  )
}

/* ================================================= */
/* QUICK ACTION */
/* ================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: typeof Users
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-w-0 rounded-3xl border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
          <Icon className="h-5 w-5 text-emerald-600" />
        </div>

        <ArrowRight className="h-4 w-4 text-stone-300 transition group-hover:text-emerald-600" />

      </div>

      <h3 className="mt-4 font-semibold text-stone-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-stone-500">
        {description}
      </p>

    </button>
  )
}

/* ================================================= */
/* HEALTH ITEM */
/* ================================================= */

function HealthItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-stone-50 p-4">

      <div className="flex items-center justify-between gap-3">

        <p className="text-sm text-stone-600">
          {label}
        </p>

        <p className="font-semibold text-stone-900">
          {value}
        </p>

      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: value }}
        />
      </div>

    </div>
  )
}