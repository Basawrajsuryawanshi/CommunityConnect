export function CommunityDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-900">Community Dashboard</h1>
        <p className="mt-2 text-sm text-stone-600">
          This page is reserved for Community Admins managing their assigned community. Unauthorized users will be redirected to /403.
        </p>
      </div>
      <div className="rounded-3xl border border-stone-200 bg-slate-50 p-8 shadow-sm">
        <p className="text-sm text-slate-700">
          Community-level navigation, events, members, announcements, and reports belong here.
        </p>
      </div>
    </div>
  )
}
