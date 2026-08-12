export function OrganizerCreateEventPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-900">Create Event</h1>
        <p className="mt-2 text-sm text-stone-600">
          Use this area to create a new event. Only event organizers see this section in the sidebar.
        </p>
      </div>
      <div className="rounded-3xl border border-stone-200 bg-slate-50 p-8 shadow-sm">
        <p className="text-sm text-slate-700">
          Placeholder UI: add event forms, details, and scheduling controls here.
        </p>
      </div>
    </div>
  )
}
