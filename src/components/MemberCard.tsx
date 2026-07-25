import { Briefcase, MapPin } from 'lucide-react'
import type { Member } from '../types'
import { Avatar } from './Avatar'
import { RoleBadge, VerifiedBadge } from './Badge'

export function MemberCard({ member }: { member: Member }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar initials={member.avatar} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-stone-900">{member.name}</h3>
            {member.verified && <VerifiedBadge />}
            <RoleBadge role={member.role} />
          </div>
          <p className="mt-0.5 text-sm text-stone-500">
            Batch {member.batch} · {member.jnv}
          </p>
          <div className="mt-2 space-y-1 text-sm text-stone-600">
            <p className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-stone-400" />
              {member.profession} at {member.company}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-stone-400" />
              {member.city}
            </p>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-stone-500">{member.bio}</p>
        </div>
      </div>
    </div>
  )
}
