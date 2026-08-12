export function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-stone-600">
          This admin portal is reserved for Super Admin users. Use these pages to manage users, roles, permissions, communities, and platform settings.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-stone-200 bg-amber-50 p-6">
          <p className="text-sm font-medium text-amber-700">Users</p>
          <p className="mt-2 text-3xl font-semibold text-stone-900">Manage users and assignments</p>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-sky-50 p-6">
          <p className="text-sm font-medium text-sky-700">Roles</p>
          <p className="mt-2 text-3xl font-semibold text-stone-900">Review role definitions and permissions</p>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-emerald-50 p-6">
          <p className="text-sm font-medium text-emerald-700">Audit</p>
          <p className="mt-2 text-3xl font-semibold text-stone-900">Monitor authorization and activity history</p>
        </div>
      </div>
    </div>
  )
}
