export function AdminPermissionsPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-900">Permission Management</h1>
        <p className="mt-2 text-sm text-stone-600">
          Super Admins can view and manage platform-wide permission definitions. This page demonstrates the permission-aware model.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-stone-200 bg-amber-50 p-6">
          <p className="text-sm font-medium text-amber-700">Permission Naming</p>
          <p className="mt-2 text-sm text-stone-900">Use structured keys like <code>users.view</code> and <code>community.members.view</code>.</p>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-sky-50 p-6">
          <p className="text-sm font-medium text-sky-700">Scope-aware</p>
          <p className="mt-2 text-sm text-stone-900">Permissions can be global or scoped to communities and events.</p>
        </div>
      </div>
    </div>
  )
}
