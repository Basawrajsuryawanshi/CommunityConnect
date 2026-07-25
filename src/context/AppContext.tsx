import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  announcements as initialAnnouncements,
  community as initialCommunity,
  currentUser as initialUser,
  discussions as initialDiscussions,
  events as initialEvents,
  members as initialMembers,
} from '../data/mockData'
import { generateBookingId, treks as initialTreks } from '../data/trekkingData'
import type {
  Announcement,
  Community,
  CurrentUser,
  Discussion,
  Event,
  Member,
  Reply,
  RsvpStatus,
} from '../types'
import type { Trek, TrekBooking } from '../types/trekking'

interface BookTrekParams {
  trekId: string
  slotId: string
  phone: string
  paymentMethod: TrekBooking['paymentMethod']
}

interface AppContextValue {
  user: CurrentUser
  community: Community
  members: Member[]
  events: Event[]
  treks: Trek[]
  trekBookings: TrekBooking[]
  announcements: Announcement[]
  discussions: Discussion[]
  updateRsvp: (eventId: string, status: RsvpStatus) => void
  bookTrek: (params: BookTrekParams) => TrekBooking | null
  toggleDiscussionLike: (discussionId: string) => void
  addReply: (discussionId: string, content: string) => void
  addDiscussion: (title: string, content: string, tags: string[]) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user] = useState<CurrentUser>(initialUser)
  const [community] = useState<Community>(initialCommunity)
  const [members] = useState<Member[]>(initialMembers)
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [treks, setTreks] = useState<Trek[]>(initialTreks)
  const [trekBookings, setTrekBookings] = useState<TrekBooking[]>([])
  const [announcements] = useState<Announcement[]>(initialAnnouncements)
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions)

  const updateRsvp = (eventId: string, status: RsvpStatus) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event
        const rsvps = { ...event.rsvps }
        if (status === null) {
          delete rsvps[user.id]
        } else {
          rsvps[user.id] = status
        }
        return { ...event, rsvps }
      }),
    )
  }

  const bookTrek = ({ trekId, slotId, phone, paymentMethod }: BookTrekParams) => {
    const trek = treks.find((t) => t.id === trekId)
    const slot = trek?.slots.find((s) => s.id === slotId)
    if (!trek || !slot || slot.availableSeats <= 0) return null

    const booking: TrekBooking = {
      id: generateBookingId(),
      trekId: trek.id,
      trekName: trek.name,
      state: trek.state,
      slotId: slot.id,
      slotDate: slot.date,
      reportingTime: slot.reportingTime,
      amount: trek.rate,
      userId: user.id,
      userName: user.name,
      phone,
      paymentMethod,
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
    }

    setTreks((prev) =>
      prev.map((t) => {
        if (t.id !== trekId) return t
        return {
          ...t,
          slots: t.slots.map((s) =>
            s.id === slotId ? { ...s, availableSeats: s.availableSeats - 1 } : s,
          ),
        }
      }),
    )
    setTrekBookings((prev) => [booking, ...prev])
    return booking
  }

  const toggleDiscussionLike = (discussionId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== discussionId) return d
        const liked = d.likedBy.includes(user.id)
        return {
          ...d,
          likes: liked ? d.likes - 1 : d.likes + 1,
          likedBy: liked
            ? d.likedBy.filter((id) => id !== user.id)
            : [...d.likedBy, user.id],
        }
      }),
    )
  }

  const addReply = (discussionId: string, content: string) => {
    const reply: Reply = {
      id: `r-${Date.now()}`,
      content,
      author: user.name,
      authorAvatar: user.avatar,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId ? { ...d, replies: [...d.replies, reply] } : d,
      ),
    )
  }

  const addDiscussion = (title: string, content: string, tags: string[]) => {
    const discussion: Discussion = {
      id: `d-${Date.now()}`,
      title,
      content,
      author: user.name,
      authorAvatar: user.avatar,
      createdAt: new Date().toISOString().split('T')[0],
      tags,
      likes: 0,
      likedBy: [],
      replies: [],
    }
    setDiscussions((prev) => [discussion, ...prev])
  }

  return (
    <AppContext.Provider
      value={{
        user,
        community,
        members,
        events,
        treks,
        trekBookings,
        announcements,
        discussions,
        updateRsvp,
        bookTrek,
        toggleDiscussionLike,
        addReply,
        addDiscussion,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function getRsvpCount(event: Event, status: RsvpStatus) {
  return Object.values(event.rsvps).filter((s) => s === status).length
}

export function getUserRsvp(event: Event, userId: string): RsvpStatus {
  return event.rsvps[userId] ?? null
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date(new Date().toDateString())
}
