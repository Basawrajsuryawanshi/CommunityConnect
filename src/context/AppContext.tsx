import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import authService from '../services/authService'
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
  const { user: authUser, isAuthenticated } = useAuth()

  // Initialize user with data from localStorage or fallback to mock data
  const [user, setUser] = useState<CurrentUser>(() => {
    if (isAuthenticated && authUser) {
      return {
        id: authUser.id,
        name: localStorage.getItem('userName') || authUser.name || 'User',
        avatar: localStorage.getItem('userAvatar') || authUser.avatar || authUser.name.split(' ').map(n => n[0]).join(''),
        role: (localStorage.getItem('userRole') as 'admin' | 'moderator' | 'member') || 'member',
        batch: localStorage.getItem('userBatch') || '',
        jnv: localStorage.getItem('userJnv') || '',
      }
    }
    return initialUser
  })

  // Sync user data when authUser changes or on mount
  useEffect(() => {
    if (isAuthenticated && authUser) {
      // Try to load from localStorage first
      const storedName = localStorage.getItem('userName')
      const storedBatch = localStorage.getItem('userBatch')
      const storedJnv = localStorage.getItem('userJnv')
      const storedRole = localStorage.getItem('userRole') as 'admin' | 'moderator' | 'member'
      const storedAvatar = localStorage.getItem('userAvatar')

      if (storedName && storedBatch && storedJnv) {
        // We have complete profile data in localStorage
        setUser({
          id: authUser.id,
          name: storedName,
          avatar: storedAvatar || authUser.avatar || storedName.split(' ').map(n => n[0]).join(''),
          role: storedRole || 'member',
          batch: storedBatch,
          jnv: storedJnv,
        })
      } else {
        // Profile data not in localStorage, try to fetch from backend
        authService.getUserProfile()
          .then(profile => {
            setUser({
              id: profile.userId,
              name: profile.name,
              avatar: profile.avatar || authUser.avatar || profile.name.split(' ').map(n => n[0]).join(''),
              role: profile.role,
              batch: profile.batch,
              jnv: profile.jnv,
            })
          })
          .catch(error => {
            console.warn('Failed to fetch user profile in AppContext:', error)
            // Fallback to basic data from authUser
            setUser({
              id: authUser.id,
              name: authUser.name,
              avatar: authUser.avatar || authUser.name.split(' ').map(n => n[0]).join(''),
              role: 'member',
              batch: '',
              jnv: '',
            })
          })
      }
    } else {
      // User logged out, reset to mock data
      setUser(initialUser)
    }
  }, [authUser, isAuthenticated])

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
