import { Building2, Globe, MapPin, Shield, Users } from 'lucide-react'
import { VerifiedBadge } from '../components/Badge'
import { useApp } from '../context/AppContext'

const futureCommunities = [
  { name: 'College Alumni', status: 'Planned' },
  { name: 'Corporate Organizations', status: 'Planned' },
  { name: 'Apartment Communities', status: 'Planned' },
  { name: 'NGOs & Non-profits', status: 'Planned' },
  { name: 'Sports Clubs', status: 'Planned' },
  { name: 'Interest Groups', status: 'Planned' },
]

export function CommunityPage() {
  const { community, members } = useApp()

  const admins = members.filter((m) => m.role === 'admin' || m.role === 'moderator')

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Community Profile</h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage and explore your verified community space
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className={`h-24 bg-gradient-to-r ${community.coverGradient}`} />
        <div className="p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <VerifiedBadge label="Verified Community" />
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
              {community.type}
            </span>
          </div>
          <h2 className="font-serif text-3xl text-stone-900">{community.name}</h2>
          <p className="mt-1 text-lg text-emerald-700">{community.tagline}</p>
          <p className="mt-4 leading-relaxed text-stone-600">{community.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
              <Users className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs text-stone-500">Members</p>
                <p className="font-semibold text-stone-900">
                  {community.memberCount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs text-stone-500">Region</p>
                <p className="font-semibold text-stone-900">{community.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
              <Building2 className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs text-stone-500">Founded</p>
                <p className="font-semibold text-stone-900">{community.foundedYear}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
              <Shield className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs text-stone-500">Trust Level</p>
                <p className="font-semibold text-stone-900">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-stone-900">Community Leaders</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {admins.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                {m.avatar}
              </div>
              <div>
                <p className="font-medium text-stone-900">{m.name}</p>
                <p className="text-xs capitalize text-stone-500">
                  {m.role} · Batch {m.batch}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-stone-900">Expansion Roadmap</h3>
        </div>
        <p className="mb-4 text-sm text-stone-600">
          CommunityConnect launches with JNV Alumni and will expand to serve diverse verified
          communities across India.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-900">JNV Alumni Network</p>
            <p className="mt-1 text-xs text-emerald-700">Live — Current Community</p>
          </div>
          {futureCommunities.map(({ name, status }) => (
            <div
              key={name}
              className="rounded-xl border border-stone-200 bg-white p-4 opacity-75"
            >
              <p className="font-medium text-stone-700">{name}</p>
              <p className="mt-1 text-xs text-stone-400">{status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
