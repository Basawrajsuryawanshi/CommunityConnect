import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { MemberCard } from '../components/MemberCard'
import { useApp } from '../context/AppContext'

export function MembersPage() {
  const { members } = useApp()
  const [search, setSearch] = useState('')
  const [batchFilter, setBatchFilter] = useState('all')

  const batches = useMemo(
    () =>
      ['all', ...Array.from(new Set(members.map((m) => m.batch))).sort((a, b) =>
        b.localeCompare(a),
      )],
    [members],
  )

  const filtered = members.filter((m) => {
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.profession.toLowerCase().includes(search.toLowerCase()) ||
      m.city.toLowerCase().includes(search.toLowerCase()) ||
      m.jnv.toLowerCase().includes(search.toLowerCase())
    const matchesBatch = batchFilter === 'all' || m.batch === batchFilter
    return matchesSearch && matchesBatch
  })

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Member Directory</h1>
        <p className="mt-1 text-sm text-stone-500">
          Connect with verified alumni across batches, professions, and cities
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, profession, city, or JNV..."
            className="w-full rounded-lg border border-stone-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        >
          {batches.map((b) => (
            <option key={b} value={b}>
              {b === 'all' ? 'All Batches' : `Batch ${b}`}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm text-stone-500">
        Showing {filtered.length} of {members.length} members
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}
