export function OrganizerBookingsPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-900">Event Bookings</h1>
        <p className="mt-2 text-sm text-stone-600">
          Review bookings for your managed events. This page is visible only to organizers with booking permissions.
        </p>
      </div>
      <div className="rounded-3xl border border-stone-200 bg-slate-50 p-8 shadow-sm">
        <p className="text-sm text-slate-700">
          Placeholder UI: the booking list and attendee summary can appear here.
        </p>
      </div>
    </div>
  )
}
