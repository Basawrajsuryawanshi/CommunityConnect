export function OrganizerDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-900">Organizer Dashboard</h1>
        <p className="mt-2 text-sm text-stone-600">
          This page is reserved for Event Organizers. It is protected by event-level authorization in the route guard.
        </p>
      </div>
      <div className="rounded-3xl border border-stone-200 bg-slate-50 p-8 shadow-sm">
        <p className="text-sm text-slate-700">
          Organizer dashboards are scoped to specific event operations, bookings, attendees, and event editing.
        </p>
      </div>
    </div>
  )
}
