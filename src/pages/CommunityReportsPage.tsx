import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  Flag,
} from 'lucide-react'
import { useState } from 'react'

type ReportStatus =
  | 'Pending'
  | 'Under Review'
  | 'Resolved'

type Report = {
  id: string
  type: string
  reportedBy: string
  reportedUser: string
  reason: string
  status: ReportStatus
  date: string
}

const initialReports: Report[] = [
  {
    id: 'r-1',
    type: 'Post',
    reportedBy: 'Rahul Kumar',
    reportedUser: 'Amit Sharma',
    reason: 'Inappropriate content',
    status: 'Pending',
    date: '12 Aug 2026',
  },
  {
    id: 'r-2',
    type: 'Member',
    reportedBy: 'Priya Singh',
    reportedUser: 'Vijay Kumar',
    reason: 'Spam / unwanted messages',
    status: 'Under Review',
    date: '11 Aug 2026',
  },
  {
    id: 'r-3',
    type: 'Event',
    reportedBy: 'Anil Kumar',
    reportedUser: 'Event Organizer',
    reason: 'Incorrect event information',
    status: 'Resolved',
    date: '10 Aug 2026',
  },
]

export function CommunityReportsPage() {
  const [reports, setReports] =
    useState<Report[]>(initialReports)

  const handleStatusChange = (
    id: string,
    status: ReportStatus,
  ) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, status }
          : report,
      ),
    )
  }

  return (
    <div className="min-w-0 max-w-full space-y-6">

      {/* Header */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
            <Flag className="h-6 w-6 text-rose-600" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-stone-900">
              Reports
            </h1>

            <p className="mt-1 text-sm text-stone-600">
              Review and manage reports submitted by community members.
            </p>
          </div>

        </div>

      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-3xl border border-stone-200 bg-amber-50 p-5">
          <p className="text-sm font-medium text-amber-700">
            Pending
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {
              reports.filter(
                (report) =>
                  report.status === 'Pending',
              ).length
            }
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-sky-50 p-5">
          <p className="text-sm font-medium text-sky-700">
            Under Review
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {
              reports.filter(
                (report) =>
                  report.status === 'Under Review',
              ).length
            }
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-700">
            Resolved
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {
              reports.filter(
                (report) =>
                  report.status === 'Resolved',
              ).length
            }
          </p>
        </div>

      </div>

      {/* Table */}
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-left text-sm">

            <thead className="bg-stone-50">

              <tr>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Type
                </th>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Reported By
                </th>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Reported User
                </th>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Reason
                </th>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Status
                </th>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Date
                </th>

                <th className="px-5 py-4 text-center font-semibold text-stone-600">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-stone-200">

              {reports.map((report) => (

                <tr
                  key={report.id}
                  className="hover:bg-stone-50"
                >

                  <td className="px-5 py-4">

                    <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                      {report.type}
                    </span>

                  </td>

                  <td className="px-5 py-4 font-medium text-stone-800">
                    {report.reportedBy}
                  </td>

                  <td className="px-5 py-4 text-stone-700">
                    {report.reportedUser}
                  </td>

                  <td className="px-5 py-4 text-stone-600">
                    {report.reason}
                  </td>

                  <td className="px-5 py-4">

                    {report.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        <Clock3 className="h-3.5 w-3.5" />
                        Pending
                      </span>
                    )}

                    {report.status === 'Under Review' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                        <Eye className="h-3.5 w-3.5" />
                        Under Review
                      </span>
                    )}

                    {report.status === 'Resolved' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Resolved
                      </span>
                    )}

                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-stone-500">
                    {report.date}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-center gap-2">

                      {report.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              report.id,
                              'Under Review',
                            )
                          }
                          className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                        >
                          Review
                        </button>
                      )}

                      {report.status === 'Under Review' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              report.id,
                              'Resolved',
                            )
                          }
                          className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          Resolve
                        </button>
                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  )
}