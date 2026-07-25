import { NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  Calendar,
  Home,
  LayoutGrid,
  MessageSquare,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Avatar } from './Avatar'
import { VerifiedBadge } from './Badge'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/announcements', icon: Bell, label: 'Announcements' },
  { to: '/discussions', icon: MessageSquare, label: 'Discussions' },
  { to: '/community', icon: LayoutGrid, label: 'Community' },
]

export function Layout() {
  const { user, community } = useApp()

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-stone-200 bg-white lg:flex">
        <div className="border-b border-stone-100 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-sm">
              CC
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">CommunityConnect</p>
              <p className="text-xs text-stone-500">Verified Communities</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-stone-100 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
            <Avatar initials={user.avatar} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-stone-900">{user.name}</p>
              <p className="truncate text-xs text-stone-500">
                Batch {user.batch} · {user.jnv}
              </p>
            </div>
            <Settings className="h-4 w-4 shrink-0 text-stone-400" />
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/80 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
                CC
              </div>
              <span className="text-sm font-bold">CommunityConnect</span>
            </div>

            <div className="hidden flex-1 lg:block">
              <div className="relative max-w-md">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="search"
                  placeholder="Search members, events, discussions..."
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pr-4 pl-10 text-sm outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <VerifiedBadge label={community.name.split(' ').slice(0, 2).join(' ')} />
              <Avatar initials={user.avatar} size="sm" className="lg:hidden" />
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto border-t border-stone-100 px-4 py-2 lg:hidden">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
