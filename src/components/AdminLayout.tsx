import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, Users, ShieldCheck, LayoutGrid, FileText, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Avatar } from './Avatar'
import { VerifiedBadge } from './Badge'
import { PERMISSIONS } from '../auth/auth'

const navItems = [
  { to: '/admin/dashboard', icon: Home, label: 'Dashboard', permission: PERMISSIONS.ADMIN_DASHBOARD_VIEW },
  { to: '/admin/users', icon: Users, label: 'Users', permission: PERMISSIONS.USERS_VIEW },
  { to: '/admin/roles', icon: ShieldCheck, label: 'Roles', permission: PERMISSIONS.ROLES_VIEW },
  { to: '/admin/permissions', icon: LayoutGrid, label: 'Permissions', permission: PERMISSIONS.PERMISSIONS_VIEW },
  { to: '/admin/communities', icon: FileText, label: 'Communities', permission: PERMISSIONS.COMMUNITIES_VIEW },
  { to: '/admin/settings', icon: Settings, label: 'Settings', permission: PERMISSIONS.SETTINGS_VIEW }, 
]

export function AdminLayout() {
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
              CC
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">Admin Portal</p>
              <p className="text-xs text-stone-500">Super Admin access</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems
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
        </nav>

        <div className="mt-auto border-t border-stone-200 pt-6">
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4">
            <Avatar initials={user?.avatar ?? 'CC'} size="sm" />
            <div>
              <p className="text-sm font-semibold text-stone-900">{user?.name}</p>
              <p className="text-xs text-stone-500">Super Admin</p>
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
              <p className="text-sm font-semibold text-stone-500">Platform administration</p>
              <h1 className="text-2xl font-semibold text-stone-900">Admin Dashboard</h1>
            </div>
            <VerifiedBadge label="SuperAdmin" />
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
