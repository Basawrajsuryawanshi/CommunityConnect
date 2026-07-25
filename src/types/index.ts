export type RsvpStatus = 'going' | 'maybe' | 'not_going' | null

export type MemberRole = 'admin' | 'moderator' | 'member'

export interface Community {
  id: string
  name: string
  tagline: string
  description: string
  type: string
  verified: boolean
  memberCount: number
  location: string
  foundedYear: number
  coverGradient: string
}

export interface Member {
  id: string
  name: string
  batch: string
  jnv: string
  role: MemberRole
  profession: string
  company: string
  city: string
  avatar: string
  verified: boolean
  joinedAt: string
  bio: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: 'reunion' | 'meetup' | 'webinar' | 'workshop'
  organizer: string
  capacity: number
  rsvps: Record<string, RsvpStatus>
  imageGradient: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  pinned: boolean
  category: 'general' | 'opportunity' | 'update' | 'celebration'
}

export interface Discussion {
  id: string
  title: string
  content: string
  author: string
  authorAvatar: string
  createdAt: string
  replies: Reply[]
  tags: string[]
  likes: number
  likedBy: string[]
}

export interface Reply {
  id: string
  content: string
  author: string
  authorAvatar: string
  createdAt: string
}

export interface CurrentUser {
  id: string
  name: string
  avatar: string
  role: MemberRole
  batch: string
  jnv: string
}
