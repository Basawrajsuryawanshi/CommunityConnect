import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, Calendar, Users, Ticket, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Avatar } from './Avatar'
import { VerifiedBadge } from './Badge'
import { PERMISSIONS } from '../auth/auth'

const managementNavItems = [
  { to: '/organizer/dashboard', icon: Home, label: 'Dashboard', permission: PERMISSIONS.ORGANIZER_DASHBOARD_VIEW },
  { to: '/organizer/events/create', icon: Calendar, label: 'Create Event', permission: PERMISSIONS.EVENTS_CREATE },
  { to: '/organizer/events', icon: Ticket, label: 'My Events', permission: PERMISSIONS.EVENTS_VIEW },
]

const otherNavItems = [
  { to: '/organizer/bookings', icon: Users, label: 'Bookings', permission: PERMISSIONS.EVENT_BOOKINGS_VIEW },
  { to: '/organizer/settings', icon: Settings, label: 'Settings', permission: PERMISSIONS.SETTINGS_VIEW },
]

export function OrganizerLayout() {
  const { user, logout, hasPermission } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-72 border-r border-stone-200 bg-white px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-sm">
              EO
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">Event Organizer</p>
              <p className="text-xs text-stone-500">Manage events</p>
            </div>
          </div>
        </div>

        <nav className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Event management</p>
            <div className="mt-3 space-y-2">
              {managementNavItems
                .filter((item) => hasPermission(item.permission))
                .map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`
                    }
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {label}
                  </NavLink>
                ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Operations</p>
            <div className="mt-3 space-y-2">
              {otherNavItems
                .filter((item) => hasPermission(item.permission))
                .map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`
                    }
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {label}
                  </NavLink>
                ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto border-t border-stone-200 pt-6">
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4">
            <Avatar initials={user?.avatar ?? 'CC'} size="sm" />
            <div>
              <p className="text-sm font-semibold text-stone-900">{user?.name}</p>
              <p className="text-xs text-stone-500">Organizer</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-stone-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-stone-500">Event operations</p>
              <h1 className="text-2xl font-semibold text-stone-900">Organizer Dashboard</h1>
            </div>
            <VerifiedBadge label="EventOrganizer" />
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
